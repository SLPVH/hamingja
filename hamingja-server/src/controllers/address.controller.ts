import {JsonController, Get } from "routing-controllers";

@JsonController('/address')
export class AddressController {

  @Get()
  getAddress() {
    return '';
  }
}
