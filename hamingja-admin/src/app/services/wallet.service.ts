import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BITBOX } from 'bitbox-sdk/lib/BITBOX';
import { Utils } from 'slpjs';
import { HDNode } from 'bitcoincashjs-lib';

const network: string = 'testnet';
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
}
