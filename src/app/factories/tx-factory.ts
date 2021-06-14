import { TxType } from "src/app/types/tx-type";

export function createTxObject(data: any): TxType {
  return {
    from: data.from,
    to: data.to,
    value: data.value,
    data: data.data,
    nonce: data.nonce,
    gasPrice: data.gasPrice,
    gas: data.gas
  };
}