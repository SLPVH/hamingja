import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule'},
  { path: 'funds', loadChildren: './funds/funds.module#FundsPageModule' },
  { path: 'create-stamp', loadChildren: './create-stamp/create-stamp.module#CreateStampPageModule' },
  { path: 'stamp-details', loadChildren: './stamp-details/stamp-details.module#StampDetailsPageModule' },
  { path: 'scan-qr', loadChildren: './modal/scan-qr/scan-qr.module#ScanQRPageModule' },
  { path: 'deposit', loadChildren: './deposit/deposit.module#DepositPageModule' },
  { path: 'withdraw', loadChildren: './withdraw/withdraw.module#WithdrawPageModule' },
  { path: 'result', loadChildren: './result/result.module#ResultPageModule' },
  // { path: 'stamps', loadChildren: './stamps/stamps.module#StampsPageModule' },
  // { path: 'tickets', loadChildren: './tickets/tickets.module#TicketsPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
