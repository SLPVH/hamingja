import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './home.page';
import { ComponentsModule } from '../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'stamps',
        loadChildren: '../stamps/stamps.module#StampsPageModule'
      },
      {
        path: 'tickets',
        loadChildren: '../tickets/tickets.module#TicketsPageModule'
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
