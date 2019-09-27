import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NgxKjuaModule } from 'ngx-kjua';

import { DepositPage } from './deposit.page';

const routes: Routes = [
  {
    path: '',
    component: DepositPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxKjuaModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DepositPage]
})
export class DepositPageModule {}
