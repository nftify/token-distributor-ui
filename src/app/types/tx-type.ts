export type TxType = {
  from: string,
  to: string,
  value: string,
  data: string,
  nonce?: string,
  gasPrice?: string,
  gas?: string,
}

export type ContractType = {
  name: string,
  contract: string,
}
