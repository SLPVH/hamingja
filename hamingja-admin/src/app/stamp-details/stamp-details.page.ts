import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Stamp } from '../services/stamp';
import { ModalController } from '@ionic/angular';
import { ScanQRPage } from '../modal/scan-qr/scan-qr.page';
import { OverlayEventDetail } from '@ionic/core';
import { ScanResult } from '../modal/scan-qr/scan-result';
import { WalletService } from '../services/wallet.service';
import { SpednService } from '../services/spedn.service';

@Component({
  selector: 'app-stamp-details',
  templateUrl: './stamp-details.page.html',
  styleUrls: ['./stamp-details.page.scss'],
})
export class StampDetailsPage implements OnInit {
  stamp: Partial<Stamp> = {};
  amount: number;

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private wallet: WalletService,
    private spedn: SpednService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.stamp.name = params.get('name');
      this.stamp.max = parseInt(params.get('max'));
      this.stamp.balance = parseInt(params.get('balance'));
      this.stamp.coupon = params.get('coupon');
      this.stamp.tokenId = params.get('tokenId');

      console.log(this.stamp);
    });
  }

  async onGiftPointClicked() {
    // const modal = await this.modalController.create({
    //   component: ScanQRPage,
    // });

    // await modal.present();

    // const {data}: OverlayEventDetail<ScanResult> = await modal.onWillDismiss();
    // if (!data || !data.text) {
    //   return;
    // }

    // console.log(data.text);

    // const customerAddress = data.text;
    const customerAddress = 'bitcoincash:qz9plpytat9flm938f8q59hgv80jxdax6s5ytm2jkx';

    const destAddress = await this.spedn.getAddress(this.wallet.cashAddress(), customerAddress, this.stamp.max, this.stamp.tokenId);
    console.log(destAddress);

    const txid = await this.wallet.sendStamps(this.wallet.toSlpAddress(destAddress), this.stamp.tokenId, 1, customerAddress);
    if (txid) {
      console.log('success');
    } else {
      console.log('error');
    }

  }
}
