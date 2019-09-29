import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QRCodePage } from 'src/app/modal/qrcode/qrcode.page';
import { Stamp } from './stamp';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-stamps',
  templateUrl: './stamps.page.html',
  styleUrls: ['./stamps.page.scss'],
})
export class StampsPage implements OnInit {
  stamps: Stamp[];

  constructor(
    private modalController: ModalController,
    private wallet: WalletService,
  ) { }

  async ngOnInit() {
    console.log(this.wallet.cashAddress());
    const stampInfo = await this.wallet.getStampInfo();
    console.log(stampInfo);
    this.stamps = stampInfo;

    // for debug
    this.stamps.push(
      {name: 'dummy1', max: 5, amount: 1, tokenId: 'dummy1', covenantInfo: {address: '', redeem_script: ''}, coupon: '', ownerAddress: ''},
      {name: 'dummy2', max: 5, amount: 5, tokenId: 'dummy2', covenantInfo: {address: '', redeem_script: ''}, coupon: '', ownerAddress: ''},
    )
  }

  async onNewCardClicked() {
    const modal = await this.modalController.create({
      component: QRCodePage,
      componentProps: {
        data: this.wallet.cashAddress(),
      },
    });

    await modal.present();
  }

  stringify(stamp) {
    return JSON.stringify(stamp);
  }
}
