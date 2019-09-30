import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/storage';



@Injectable({
  providedIn: 'root'
})
export class CloudStorageService {
  private storage: firebase.storage.Storage;

  constructor() {
    this.storage = firebase.storage();
  }

  initialize() {
  }

  async getFileInfo(id: string) {
    const ref = this.storage.ref().child(`images/${id}`);

    // const metadata = await ref.getMetadata();
    const url: string = await ref.getDownloadURL();

    return {
      // metadata,
      url,
    }
  }
}
