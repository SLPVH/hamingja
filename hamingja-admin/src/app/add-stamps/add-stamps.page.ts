import { Component, OnInit } from '@angular/core';
import { WalletService } from '../services/wallet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Stamp } from '../services/stamp';

@Component({
  selector: 'app-add-stamps',
  templateUrl: './add-stamps.page.html',
  styleUrls: ['./add-stamps.page.scss'],
})
export class AddStampsPage implements OnInit {
  stamp: Partial<Stamp> = {};
  amount: string;

  constructor(
    private wallet: WalletService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.stamp.name = params.get('name');
      this.stamp.max = parseInt(params.get('max'));
      this.stamp.balance = parseInt(params.get('balance'));
      this.stamp.coupon = params.get('coupon');
      this.stamp.tokenId = params.get('tokenId');

      console.log(this.stamp);
    });
  }

  async onAddStampsClicked() {
    if (!this.stamp.tokenId || this.amount === '') {
      return;
    }

    const txid = await this.wallet.mint(this.stamp.tokenId, parseInt(this.amount));

    this.router.navigate([
      '/result',
      {
        result: `${this.amount} Stamps Added`,
        back_path: `/stamp-details`,
        param: JSON.stringify(this.stamp),
      }
    ]);
  }
}
