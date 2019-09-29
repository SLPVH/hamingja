import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BITBOX } from 'bitbox-sdk/lib/BITBOX';
import { Utils, BitboxNetwork, SlpTransactionDetails } from 'slpjs';
import { HDNode } from 'bitcoincashjs-lib';
import BigNumber from 'bignumber.js';
import { SpednService } from './spedn.service';
import { GenericP2SH, TxBuilder, SigHash } from "spedn";
import { Stamp } from '../home/stamps/stamp';
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

  constructor(private storage: Storage, private spedn: SpednService) {
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

  // private stampInfoNode(): HDNode {
  //   return this.bitbox.HDNode.derivePath(this.masterHDNode, `m/44'/924'/0'/0/0`);
  // }

  private slpNode(): HDNode {
    return this.bitbox.HDNode.derivePath(this.masterHDNode, `m/44'/245'/0'/0/0`);
  }

  // stampAddress(): string {
  //   return this.bitbox.HDNode.toCashAddress(this.stampInfoNode());
  // }

  cashAddress(): string {
    return this.bitbox.HDNode.toCashAddress(this.slpNode());
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

  async getStampInfo() {
    const txs = await this.bitbox.Address.transactions(this.cashAddress());
    if (Array.isArray(txs)) {
      return;
    }

    console.log(txs.txs);

    const opReturns: string[] = txs.txs.filter(tx => {
      if (tx.vout.length < 1) {
        return false;
      }

      const asm: string = tx.vout[0]['scriptPubKey'].asm;
      if (!asm.startsWith('OP_RETURN')) {
        return false;
      }

      return true;
    }).map(tx => {
      const asm: string = tx.vout[0]['scriptPubKey'].asm;
      return asm;
    });

    console.log(opReturns);

    const stampsAll = opReturns.map(opReturn => {
      try {
        const ops = opReturn.split(' ');
        const target = Buffer.from(ops[1], 'hex').toString('utf-8');
        const obj = JSON.parse(target);

        return obj;
      } catch (e) {
        console.log(e);
        return undefined;
      }
    }).filter(obj => {
      return obj && obj.id === 'hamingja' && obj.owner_pkh && obj.token_id;
    }).map(obj => {
      return {
        ownerPkh: obj.owner_pkh as string,
        tokenId: obj.token_id as string,
      }
    });

    console.log(stampsAll);
    const stamps = stampsAll; // TODO: filter same tokenId;

    const bitboxNetwork = new BitboxNetwork(this.bitbox);

    let info = [];

    for (let i = 0; i < stamps.length; ++i) {
      const stamp = stamps[i];
      if (info.some(v => v.tokenId === stamp.tokenId)) {
        continue;
      }
      const tokenInfo: SlpTransactionDetails = await bitboxNetwork.getTokenInformation(stamp.tokenId);

      const document = JSON.parse(tokenInfo.documentUri);

      const ownerAddress = this.bitbox.Address.hash160ToCash(stamp.ownerPkh, network === 'mainnet' ? 0x00 : 0x6f);

      const covenantInfo = await this.spedn.getCovenantInfo(
        ownerAddress,
        this.cashAddress(),
        document.max,
        stamp.tokenId
      );

      const balances = await bitboxNetwork.getAllSlpBalancesAndUtxos(this.toSlpAddress(covenantInfo.address));
      if (Array.isArray(balances)) {
        continue;
      }
      const amount = balances.slpTokenBalances[stamp.tokenId];
      if (!amount) {
        console.log('no balance', stamp.tokenId, balances.slpTokenBalances);
        continue;
      }

      info.push({
        tokenId: stamp.tokenId,
        covenantInfo,
        name: tokenInfo.name,
        max: document.max,
        coupon: document.coupon,
        amount: amount.toNumber(),
        ownerAddress,
      });
    }

    return info;
  }

  async useStamp(stamp: Stamp) {
    const contract = new GenericP2SH(
      Buffer.from(stamp.covenantInfo.redeem_script, 'hex'),
      {pk: 'PubKey', sig: 'Sig', preimage: 'bin', changeOutput: 'bin'}
    );

    const coins = await contract.findCoins(network);
    console.log(coins);

    const maxBuf = Buffer.alloc(8);
    maxBuf.writeUInt32BE(stamp.max, 4); // support 64 bit
    const opReturn = Buffer.from(
      '6a'+'04534c5000'+'0101'+'0453454e44'+'20'+stamp.tokenId+'08'+maxBuf.toString('hex'),
      'hex'
    );
    console.log(opReturn.toString('hex'));

    const balance = coins.reduce((b, c) => b+c.utxo.satoshis, 0);
    const fee = 200 + coins.length * 900;
    const change = balance - fee - 546;

    console.log(balance, fee, change);

    const changeBuf = Buffer.alloc(8);
    changeBuf.writeUInt32LE(change, 0);
    const out2 = this.bitbox.Script.encode([
      this.bitbox.Script.opcodes.OP_DUP,
      this.bitbox.Script.opcodes.OP_HASH160,
      this.bitbox.HDNode.toIdentifier(this.slpNode()),
      this.bitbox.Script.opcodes.OP_EQUALVERIFY,
      this.bitbox.Script.opcodes.OP_CHECKSIG,
    ]);

    const txb = new TxBuilder(network)
      .from(coins, (input, context) => {
        const preimage = context.preimage(SigHash.SIGHASH_ALL);
        return input.spend({
          pk: this.bitbox.HDNode.toPublicKey(this.slpNode()),
          sig: context.sign(this.bitbox.HDNode.toKeyPair(this.slpNode())),
          preimage,
          changeOutput: Buffer.concat([changeBuf, Buffer.alloc(1, 0x19), out2]),
        });
      })
      .to(opReturn, 0)
      .to(stamp.ownerAddress, 546)
      .to(this.cashAddress(), balance - 546 - fee)

    const hex = txb.build(true).toHex();
    console.log(hex, hex.length / 2);

    const [txid] = await this.bitbox.RawTransactions.sendRawTransaction([hex]);
    console.log(txid);
  }
}
