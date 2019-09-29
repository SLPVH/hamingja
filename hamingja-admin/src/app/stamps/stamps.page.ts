import { Component, OnInit } from '@angular/core';
import { Stamp } from '../services/stamp';
import { WalletService } from '../services/wallet.service';

@Component({
  selector: 'app-stamps',
  templateUrl: './stamps.page.html',
  styleUrls: ['./stamps.page.scss'],
})
export class StampsPage implements OnInit {
  public stamps: Stamp[] = [];

  constructor(private wallet: WalletService) { }

  async ngOnInit() {
    this.stamps = await this.wallet.stamps();

    console.log(this.stamps);

    // for debug
    this.stamps.push({name: 'dummy', max: 7, coupon: '1 free', balance: 10000, tokenId: 'txid'})
  }
}
