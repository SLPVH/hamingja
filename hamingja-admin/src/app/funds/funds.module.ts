import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FundsPage } from './funds.page';
import { ComponentsModule } from '../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: FundsPage,
    children: [
      {
        path: 'deposit',
        loadChildren: '../deposit/deposit.module#DepositPageModule'
      },
      {
        path: 'withdraw',
        loadChildren: '../withdraw/withdraw.module#WithdrawPageModule'
      },
    ],
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
  ],
  declarations: [FundsPage]
})
export class FundsPageModule {}
