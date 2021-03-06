import { Component, OnInit } from '@angular/core';
import { WalletService } from '../services/wallet.service';
import { Router } from '@angular/router';

import { CloudStorageService } from '../services/cloud-storage.service';

@Component({
  selector: 'app-create-stamp',
  templateUrl: './create-stamp.page.html',
  styleUrls: ['./create-stamp.page.scss'],
})
export class CreateStampPage implements OnInit {
  public enableTermination: boolean;
  public cardName = '';
  public max: string = '5';
  public coupon: string = '1 free';
  public file?: File;
  public stampShape: string = 'star';
  public stampColor: string = '#2889e9';
  public bgColor: string = '#e920e9';

  constructor(
    private wallet: WalletService,
    private cloudStorage: CloudStorageService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  onFileChanged(event) {
    console.log(event);
    if (event.target.files && event.target.files.length) {
      this.file = event.target.files[0];
    }
  }

  async onCreateClicked() {
    console.log(this.cardName, this.max, this.coupon, this.file);
    if (!this.file) {
      return;
    }

    const txid = await this.wallet.createNewToken(
      this.cardName,
      this.cardName,
      {max: this.max, coupon: this.coupon}
    );

    console.log(txid);

    const metadata = {
      stamp_shape: this.stampShape,
      stamp_color: this.stampColor,
      bg_color: this.bgColor,
    };

    const result = await this.cloudStorage.uploadImage(txid, this.file, metadata);
    console.log(result);

    this.router.navigate(['/result', {result: `Created Stamp Card`, back_path: '/home/stamps'}]);
  }
}
