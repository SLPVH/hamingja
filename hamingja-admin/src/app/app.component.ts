import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { WalletService } from './services/wallet.service';

import * as firebase from 'firebase/app';
import 'firebase/storage';

import { environment } from 'src/environments/environment';
import { CloudStorageService } from './services/cloud-storage.service';

firebase.initializeApp(environment.firebaseConfig);

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
    },
    {
      title: 'Funds',
      url: '/funds',
    },
  ];

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
    });
  }
}
