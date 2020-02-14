import { BN } from 'bn.js';


export function fromNumber(num){
  return new BN((num).toString(16), 16);
}

export function ether(num){
  return new BN((num * (10 ** 18)).toString(16), 16);
}
