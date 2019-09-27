import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.page.html',
  styleUrls: ['./deposit.page.scss'],
})
export class DepositPage implements OnInit {
  address: string = 'bitcoincash:qzfe0fj9u96r2jpln4ykegqpfvg2ucuuxyhz0zmkcy';

  constructor() { }

  ngOnInit() {
  }

}
