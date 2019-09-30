import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import * as firebase from 'firebase/app';
import 'firebase/storage';

import { environment } from 'src/environments/environment';

firebase.initializeApp(environment.firebaseConfig);

import { WalletService } from './services/wallet.service';

import { CloudStorageService } from './services/cloud-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private wallet: WalletService,
    private cloudStorage: CloudStorageService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    }).then(() => {
      return this.wallet.initialize();
    }).then(() => {
      this.cloudStorage.initialize();
    });;
  }
}
