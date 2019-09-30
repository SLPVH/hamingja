import { Component, OnInit } from '@angular/core';
import { Stamp } from '../services/stamp';
import { WalletService } from '../services/wallet.service';
import { CloudStorageService } from '../services/cloud-storage.service';

@Component({
  selector: 'app-stamps',
  templateUrl: './stamps.page.html',
  styleUrls: ['./stamps.page.scss'],
})
export class StampsPage implements OnInit {
  public stamps: Stamp[] = [];

  constructor(private wallet: WalletService, private cloudStorage: CloudStorageService) { }

  async ngOnInit() {
    const stamps = await this.wallet.stamps();

    this.stamps = await Promise.all(stamps.map(async stamp => {
      try {
        const fileInfo = await this.cloudStorage.getFileInfo(stamp.tokenId);
        return {
          ...stamp,
          url: fileInfo.url,
          stampShape: fileInfo.metadata.customMetadata.stamp_shape,
        };
      } catch (e) {
        console.log(e);
        return stamp;
      }
    }));

    console.log(this.stamps);

    // for debug
    // this.stamps.push({name: 'dummy', max: 7, coupon: '1 free', balance: 10000, tokenId: 'txid'})
  }
}
