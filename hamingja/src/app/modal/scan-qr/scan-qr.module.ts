import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { ScanQRPage } from './scan-qr.page';

const routes: Routes = [
  {
    path: '',
    component: ScanQRPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZXingScannerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ScanQRPage]
})
export class ScanQRPageModule {}
