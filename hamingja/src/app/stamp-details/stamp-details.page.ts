import { Component, OnInit } from '@angular/core';
import { Stamp } from '../home/stamps/stamp';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { QRCodePage } from '../modal/qrcode/qrcode.page';
import { ScanQRPage } from '../modal/scan-qr/scan-qr.page';
import { OverlayEventDetail } from '@ionic/core';
import { ScanResult } from '../modal/scan-qr/scan-result';
import { WalletService } from '../services/wallet.service';
import { CloudStorageService } from '../services/cloud-storage.service';

interface StampDetails extends Stamp {
  info: string;
}

@Component({
  selector: 'app-stamp-details',
  templateUrl: './stamp-details.page.html',
  styleUrls: ['./stamp-details.page.scss'],
})
export class StampDetailsPage implements OnInit {
  stamp: StampDetails;
  image: string = '';

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private wallet: WalletService,
    private cloudStorage: CloudStorageService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const obj = JSON.parse(params.get('stamp'));
      this.stamp = obj;
      this.stamp.max = parseInt(obj.max);
      this.stamp.amount = parseInt(obj.amount);
      this.stamp.info = 'info';

      console.log(this.stamp);

      try {
        const fileInfo = await this.cloudStorage.getFileInfo(this.stamp.tokenId);

        this.image = fileInfo.url;
        console.log(fileInfo);
      } catch (e) {
        console.log(e);
      }
    });
    console.log(this.image)
  }

  async onGetStampClicked() {
    const modal = await this.modalController.create({
      component: QRCodePage,
      componentProps: {
        data: this.wallet.cashAddress(),
      },
    });

    await modal.present();
  }

  async onUseThisClicked() {
    const modal = await this.modalController.create({
      component: ScanQRPage,
    });

    await modal.present();

    const {data}: OverlayEventDetail<ScanResult> = await modal.onWillDismiss();
    if (!data || !data.text) {
      return;
    }

    console.log(data.text);

    // if (data.text !== this.stamp.ownerAddress) {
    //   return;
    // }

    this.wallet.useStamp(this.stamp);
  }
}
