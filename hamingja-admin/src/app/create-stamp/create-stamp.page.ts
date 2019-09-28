import { Component, OnInit } from '@angular/core';
import { WalletService } from '../services/wallet.service';
import { Router } from '@angular/router';

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

  constructor(private wallet: WalletService, private router: Router) { }

  ngOnInit() {
  }

  async onCreateClicked() {
    console.log(this.cardName, this.max, this.coupon);
    const txid = await this.wallet.createNewToken(
      this.cardName,
      this.cardName,
      {max: this.max, coupon: this.coupon}
    );

    console.log(txid);
    this.router.navigate(['/result', {result: `Created Stamp Card`, back_path: '/home/stamps'}]);
  }
}
