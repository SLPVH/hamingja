import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Stamp } from '../stamps/stamp';
import { ModalController } from '@ionic/angular';
import { ScanQRPage } from '../modal/scan-qr/scan-qr.page';
import { OverlayEventDetail } from '@ionic/core';
import { ScanResult } from '../modal/scan-qr/scan-result';

@Component({
  selector: 'app-stamp-details',
  templateUrl: './stamp-details.page.html',
  styleUrls: ['./stamp-details.page.scss'],
})
export class StampDetailsPage implements OnInit {
  stamp: Partial<Stamp> = {};
  amount: number;

  constructor(private route: ActivatedRoute, private modalController: ModalController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.stamp.name = params.get('name');
      this.stamp.max = parseInt(params.get('max'));

      console.log(this.stamp);
    });

    this.amount = 10000;
  }

  async onGiftPointClicked() {
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
