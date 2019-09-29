import { JsonController, Get, QueryParam } from "routing-controllers";
import { Spedn } from 'spedn';
import path from 'path';

const network = 'mainnet';

@JsonController('/address')
export class AddressController {

  @Get()
  async getAddress(
    @QueryParam('owner_pkh', {required: true}) ownerPkh: string,
    @QueryParam('customer_pkh', {required: true}) customerPkh: string,
    @QueryParam('max_value', {required: true}) maxValue: number,
    @QueryParam('token_id', {required: true}) tokenId: string,
  ) {
    const compiler = new Spedn();
    const Covenant = await compiler.compileFile(path.resolve('spedn/covenants.spedn'));
    compiler.dispose();

    console.log(ownerPkh, customerPkh, maxValue, tokenId);

    const max = Buffer.alloc(8);
    max.writeBigInt64BE(BigInt(maxValue));

    const instance = new Covenant({
      ownerPkh: Buffer.from(ownerPkh, 'hex'),
      customerPkh: Buffer.from(customerPkh, 'hex'),
      maxValue: max,
      tokenId: Buffer.from(tokenId, 'hex'),
    });

    return {
      address: instance.getAddress(network),
      redeem_script: instance.redeemScript.toString('hex'),
    };
  }
}
