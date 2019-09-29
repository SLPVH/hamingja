import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule'},
  { path: 'qrcode', loadChildren: './modal/qrcode/qrcode.module#QRCodePageModule' },
  { path: 'stamp-details', loadChildren: './stamp-details/stamp-details.module#StampDetailsPageModule' },
  { path: 'scan-qr', loadChildren: './modal/scan-qr/scan-qr.module#ScanQRPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
