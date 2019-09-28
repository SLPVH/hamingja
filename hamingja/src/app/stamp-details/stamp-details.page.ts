import { Component, OnInit } from '@angular/core';
import { Stamp } from '../home/stamps/stamp';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { QRCodePage } from '../modal/qrcode/qrcode.page';
import { ScanQRPage } from '../modal/scan-qr/scan-qr.page';
import { OverlayEventDetail } from '@ionic/core';
import { ScanResult } from '../modal/scan-qr/scan-result';

interface StampDetails extends Stamp {
  coupon: string;
  info: string;
}

@Component({
  selector: 'app-stamp-details',
  templateUrl: './stamp-details.page.html',
  styleUrls: ['./stamp-details.page.scss'],
})
export class StampDetailsPage implements OnInit {
  stamp: Partial<StampDetails> = {max: 5, info: 'info', coupon: '1 free'};

  constructor(private route: ActivatedRoute, private modalController: ModalController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.stamp.name = params.get('name');
      this.stamp.amount = parseInt(params.get('amount'));

      console.log(this.stamp);
    });
  }

  async onGetStampClicked() {
    const modal = await this.modalController.create({
      component: QRCodePage,
      componentProps: {
        data: 'bitcoincash:qpdach7c3l69sxf0unh72zpf2tpxzvlzhsv23qvq93',
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
  }
}
