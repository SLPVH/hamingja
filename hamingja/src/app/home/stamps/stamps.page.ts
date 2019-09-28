import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QRCodePage } from 'src/app/modal/qrcode/qrcode.page';
import { Stamp } from './stamp';

@Component({
  selector: 'app-stamps',
  templateUrl: './stamps.page.html',
  styleUrls: ['./stamps.page.scss'],
})
export class StampsPage implements OnInit {
  stamps: Stamp[] = [
    {name: 'dummy1', max: 5, amount: 1},
    {name: 'dummy2', max: 5, amount: 5},
  ];

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  async onNewCardClicked() {
    const modal = await this.modalController.create({
      component: QRCodePage,
      componentProps: {
        data: 'bitcoincash:qpdach7c3l69sxf0unh72zpf2tpxzvlzhsv23qvq93',
      },
    });

    await modal.present();
  }
}
