import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { BITBOX } from 'bitbox-sdk/lib/BITBOX';

import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpednService {
  private axios: AxiosInstance;
  private bitbox: BITBOX;

  constructor() {
    this.axios = axios.create({
      baseURL: environment.spednServer,
    });
    this.bitbox = new BITBOX();
  }

  async getAddress(
    ownerAddress: string,
    customerAddress: string,
    maxValue: number,
    tokenId: string
  ) {
    const ownerPkh = this.bitbox.Address.cashToHash160(ownerAddress);
    const customerPkh = this.bitbox.Address.cashToHash160(customerAddress);

    const url = `/address?owner_pkh=${ownerPkh}&customer_pkh=${customerPkh}&max_value=${maxValue}&token_id=${tokenId}`;
    const res = await this.axios.get(url);

    console.log(res);

    return res.data.address;
  }
}
