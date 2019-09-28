import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ScanResult } from './scan-result';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.page.html',
  styleUrls: ['./scan-qr.page.scss'],
})
export class ScanQRPage implements OnInit {
  devices: MediaDeviceInfo[];
  selectedDeviceIndex: number;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  async onCloseClicked() {
    await this.close({});
  }

  private async close(result: ScanResult) {
    await this.modalController.dismiss(result);
  }

  onCamerasFound(devices: MediaDeviceInfo[]) {
    console.log(devices);
    this.devices = devices;

    this.selectedDeviceIndex = 0;
  }

  onReverseCameraClicked() {
    this.selectedDeviceIndex = (this.selectedDeviceIndex + 1) % this.devices.length;
  }

  async onScanSuccess(result: string) {
    await this.close({text: result});
  }
}
