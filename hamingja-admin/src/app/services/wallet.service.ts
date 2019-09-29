import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BITBOX } from 'bitbox-sdk/lib/BITBOX';
import { Utils, BitboxNetwork } from 'slpjs';
import { HDNode } from 'bitcoincashjs-lib';
import BigNumber from 'bignumber.js';
import { Stamp } from './stamp';
import { environment } from 'src/environments/environment';

const network = environment.network;
const restURL = (network === 'mainnet') ? 'https://rest.bitcoin.com/v2/' : 'https://trest.bitcoin.com/v2/'

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  bitbox: BITBOX;
  xpriv: string;
  masterHDNode: HDNode;

  constructor(private storage: Storage) {
    this.bitbox = new BITBOX({restURL});
  }

  async initialize() {
    let xpriv: string | undefined = await this.storage.get('xpriv');
    if (!xpriv) {
      xpriv = this.generateWallet();
      this.storage.set('xpriv', xpriv);
    }

    this.xpriv = xpriv;
    this.masterHDNode = this.bitbox.HDNode.fromXPriv(xpriv);
  }

  private generateWallet(): string {
    const mnemonic = this.bitbox.Mnemonic.generate(256);
    const rootSeed =  this.bitbox.Mnemonic.toSeed(mnemonic);
    const masterHDNode = this.bitbox.HDNode.fromSeed(rootSeed, network);
    const xpriv = this.bitbox.HDNode.toXPriv(masterHDNode);

    return xpriv;
  }

  private slpNode(): HDNode {
    return this.bitbox.HDNode.derivePath(this.masterHDNode, `m/44'/245'/0'/0/0`);
  }

  cashAddress(): string {
    const node = this.slpNode();
    return this.bitbox.HDNode.toCashAddress(node);
  }

  slpAddress(): string {
    return Utils.toSlpAddress(this.cashAddress());
  }

  toCashAddress(address: string): string {
    return Utils.toCashAddress(address);
  }

  toSlpAddress(address: string): string {
    return Utils.toSlpAddress(address);
  }

  async withdrawBch(dest: string): Promise<string | undefined> {
    const address = this.cashAddress();
    const utxos = await this.bitbox.Address.utxo(address);
    if (Array.isArray(utxos)) {
      return;
    }

    let balance = 0;
    const txb = new this.bitbox.TransactionBuilder(network);
    utxos.utxos.forEach((utxo) => {
      txb.addInput(utxo.txid, utxo.vout);
      balance += utxo.satoshis;
    });

    const byteCount = this.bitbox.BitcoinCash.getByteCount({P2PKH: utxos.utxos.length}, {P2PKH: 1});
    const fee = byteCount;

    txb.addOutput(dest, balance - fee);

    const key = this.bitbox.HDNode.toKeyPair(this.slpNode());
    utxos.utxos.forEach((utxo, i) => {
      txb.sign(i, key, undefined, txb.hashTypes.SIGHASH_ALL, utxo.satoshis);
    });

    const hex = txb.build().toHex();

    const txid = await this.bitbox.RawTransactions.sendRawTransaction(hex);

    return txid;
  }

  async balance(): Promise<number | undefined> {
    const details = await this.bitbox.Address.details(this.cashAddress());
    if (Array.isArray(details)) {
      return;
    }

    return details.unconfirmedBalanceSat + details.balanceSat;
  }

  async createNewToken(name: string, ticker: string, document: string | Object): Promise<string | undefined> {
    const fundingAddress = this.slpAddress();
    const fundingfWif = this.bitbox.HDNode.toWIF(this.slpNode());
    const tokenReceiverAddress = this.slpAddress();
    const bchChangeReceiverAddress = this.slpAddress();
    const batonReceiverAddress = this.slpAddress();

    const bitboxNetwork = new BitboxNetwork(this.bitbox);
    const balances = await bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress);
    if (Array.isArray(balances)) {
      return;
    }

    const decimals = 0;
    const initialTokenQty = new BigNumber(10000000);

    let documentHash = null;
    let documentUri: string;
    if (typeof document === 'string') {
      documentUri = document;
    } else {
      documentUri = JSON.stringify(document);
    }

    balances.nonSlpUtxos.forEach(utxo => utxo.wif = fundingfWif);

    const txid = await bitboxNetwork.simpleTokenGenesis(
      name,
      ticker,
      initialTokenQty,
      documentUri,
      documentHash,
      decimals,
      tokenReceiverAddress,
      batonReceiverAddress,
      bchChangeReceiverAddress,
      balances.nonSlpUtxos
    );

    return txid;
  }

  async stamps(): Promise<Stamp[] | undefined> {
    const bitboxNetwork = new BitboxNetwork(this.bitbox);
    const balances = await bitboxNetwork.getAllSlpBalancesAndUtxos(this.slpAddress());
    if (Array.isArray(balances)) {
      return;
    }

    return await Promise.all(Object.keys(balances.slpTokenUtxos).map(async (key) => {
      const details = await bitboxNetwork.getTokenInformation(key);
      const document = details.documentUri;

      if (!document) {
        return undefined;
      }

      const {max, coupon} = JSON.parse(document);

      return {
        balance: balances.slpTokenBalances[key].toNumber(),
        name: details.name,
        max: parseInt(max),
        coupon,
        tokenId: key,
      };
    }).filter(v => v !== undefined));
  }

  async mint(tokenId: string, amount: number): Promise<string | undefined> {
    const fundingAddress = this.slpAddress();
    const fundingfWif = this.bitbox.HDNode.toWIF(this.slpNode());
    const tokenReceiverAddress = this.slpAddress();
    const bchChangeReceiverAddress = this.slpAddress();
    const batonReceiverAddress = this.slpAddress();

    const bitboxNetwork = new BitboxNetwork(this.bitbox);

    const balances = await bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress);
    if (Array.isArray(balances)) {
      return;
    }

    if (!balances.slpBatonUtxos[tokenId]) {
      return;
    }

    const additionalTokenQty = new BigNumber(amount);

    const inputUtxos = [...balances.slpBatonUtxos[tokenId], ...balances.nonSlpUtxos];
    inputUtxos.forEach(utxo => utxo.wif = fundingfWif);

    const txid = await bitboxNetwork.simpleTokenMint(
      tokenId,
      additionalTokenQty,
      inputUtxos,
      tokenReceiverAddress,
      batonReceiverAddress,
      bchChangeReceiverAddress
    );

    return txid;
  }

  async sendStamps(destAddress: string, tokenId: string, amount: number, customerAddress: string) {
    const fundingAddress = this.slpAddress();
    const fundingfWif = this.bitbox.HDNode.toWIF(this.slpNode());
    const bchChangeReceiverAddress = this.slpAddress();

    const bitboxNetwork = new BitboxNetwork(this.bitbox);

    const balances = await bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress);
    if (Array.isArray(balances)) {
      return;
    }

    console.log(balances.slpTokenBalances)
    if (!balances.slpTokenBalances[tokenId]) {
      console.log('no balance:', tokenId)
      return;
    }

    const sendAmount = [new BigNumber(amount), balances.slpTokenBalances[tokenId].minus(amount)];

    const inputUtxos = [
      ...balances.slpTokenUtxos[tokenId],
      ...balances.nonSlpUtxos
    ];
    inputUtxos.forEach(utxo => utxo.wif = fundingfWif);

    const txid = await bitboxNetwork.simpleTokenSend(
      tokenId,
      sendAmount,
      inputUtxos,
      [destAddress, bchChangeReceiverAddress],
      bchChangeReceiverAddress,
      [
        {satoshis: 2000, receiverAddress: bchChangeReceiverAddress},
        {satoshis: 3000, receiverAddress: destAddress},
      ]
    );

    console.log(txid);
    console.log('send info');
    const infoTxid = await this.sendTokenInfo(customerAddress, tokenId, {txid, vout: 3, satoshis: 2000});
    console.log(infoTxid);

    return txid;
  }

  async sendTokenInfo(customerAddress: string, tokenId: string, utxo: {txid: string, vout: number, satoshis: number}) {
    const address = this.cashAddress();

    const ownerPkh = this.bitbox.Address.cashToHash160(address);
    const info = {
      id: 'hamingja',
      owner_pkh: ownerPkh,
      token_id: tokenId,
    };
    const data = this.bitbox.Script.encode([
      this.bitbox.Script.opcodes.OP_RETURN,
      Buffer.from(JSON.stringify(info), 'utf-8'),
    ]);

    let balance = 0;
    const txb = new this.bitbox.TransactionBuilder(network);
    txb.addInput(utxo.txid, utxo.vout);
    balance += utxo.satoshis;

    const fee = 1000;

    txb.addOutput(data, 0);
    txb.addOutput(customerAddress, balance - fee);

    const key = this.bitbox.HDNode.toKeyPair(this.slpNode());
    // utxos.forEach((utxo, i) => {
      txb.sign(0, key, undefined, txb.hashTypes.SIGHASH_ALL, utxo.satoshis);
    // });

    const hex = txb.build().toHex();

    const txid = await this.bitbox.RawTransactions.sendRawTransaction(hex);

    return txid;
  }
}
