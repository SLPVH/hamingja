import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
})
export class BalanceComponent implements OnInit {
  balance: number;

  constructor(private wallet: WalletService) { }

  async ngOnInit() {
    this.balance = await this.wallet.balance();
  }

}
