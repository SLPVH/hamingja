import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceComponent } from './balance/balance.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [BalanceComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    BalanceComponent,
  ]
})
export class ComponentsModule { }
