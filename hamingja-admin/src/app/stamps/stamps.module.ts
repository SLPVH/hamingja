import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StampsPage } from './stamps.page';

const routes: Routes = [
  {
    path: '',
    component: StampsPage,
    children: [
      {
        path: 'create-stamp',
        loadChildren: '../create-stamp/create-stamp.module#CreateStampPageModule',
      },
    ],
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StampsPage]
})
export class StampsPageModule {}
