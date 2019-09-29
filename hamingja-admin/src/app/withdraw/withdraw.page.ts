import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ScanQRPage } from '../modal/scan-qr/scan-qr.page';
import { OverlayEventDetail } from '@ionic/core';
import { ScanResult } from '../modal/scan-qr/scan-result';
import { WalletService } from '../services/wallet.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.page.html',
  styleUrls: ['./withdraw.page.scss'],
})
export class WithdrawPage implements OnInit {
  address: string = '';

  constructor(private modalController: ModalController, private wallet: WalletService) { }

  ngOnInit() {
  }

  async onCameraClicked() {
    const modal = await this.modalController.create({
      component: ScanQRPage,
    });

    await modal.present();

    const {data}: OverlayEventDetail<ScanResult> = await modal.onWillDismiss();
    if (!data || !data.text) {
      return;
    }

    this.address = data.text;
  }

  async onWithdrawClicked() {
    console.log(this.address);
    if (this.address === '') {
      return;
    }

    const txid = await this.wallet.withdrawBch(this.address);

    console.log(txid);
  }
}
