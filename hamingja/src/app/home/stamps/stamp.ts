export interface Stamp {
  name: string;
  max: number;
  amount: number;
  tokenId: string;
  coupon: string;
  covenantInfo: {address: string, redeem_script: string};
  ownerAddress: string;
}
