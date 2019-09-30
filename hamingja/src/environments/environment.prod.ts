import { TransitiveCompileNgModuleMetadata } from '@angular/compiler';

export const environment = {
  production: TransitiveCompileNgModuleMetadata,
  spednServer: process.env.SERVER_URL || 'http://localhost:3000',
  network: 'mainnet',
  firebaseConfig: {
    apiKey: "AIzaSyCoXVaaC7s3G7Dto8EeM80Vlv-ru_otbOI",
    authDomain: "projectignite-a6260.firebaseapp.com",
    databaseURL: "https://projectignite-a6260.firebaseio.com",
    projectId: "projectignite",
    storageBucket: "projectignite.appspot.com",
    messagingSenderId: "270957819575",
    appId: "1:270957819575:web:4ed10b8243345941667f32"
  },
};
