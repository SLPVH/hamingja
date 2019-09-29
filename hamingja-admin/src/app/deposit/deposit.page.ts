import { Component, OnInit } from '@angular/core';
import { WalletService } from '../services/wallet.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.page.html',
  styleUrls: ['./deposit.page.scss'],
})
export class DepositPage implements OnInit {
  address: string = '';

  constructor(private wallet: WalletService) { }

  ngOnInit() {
    this.address = this.wallet.cashAddress();
  }

}
