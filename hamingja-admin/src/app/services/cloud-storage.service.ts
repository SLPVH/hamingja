import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class CloudStorageService {
  private storage: firebase.storage.Storage;

  constructor() {
  }

  initialize() {
    this.storage = firebase.storage();
  }

  uploadImage(id: string, file: File, customMetadata: any) {
    const ref = this.storage.ref().child(`images/${id}`);

    const metadata = {
      contentType: file.type,
      customMetadata,
    }

    return ref.put(file, metadata);
  }

  async getFileInfo(id: string) {
    const ref = this.storage.ref().child(`images/${id}`);

    const metadata = await ref.getMetadata();
    const url: string = await ref.getDownloadURL();

    return {
      metadata,
      url,
    }
  }
}
