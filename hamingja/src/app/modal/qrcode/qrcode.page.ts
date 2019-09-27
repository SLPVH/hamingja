import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QRCodePage implements OnInit {
  @Input() data: string;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    console.log(this.data);
  }

  async onCloseClicked() {
    await this.modalController.dismiss();
  }
}
