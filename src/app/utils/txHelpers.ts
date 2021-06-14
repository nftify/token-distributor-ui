import Web3 from "web3";
import { ACTIONS, DEFAULT_GAS_LIMIT } from "src/app/configs/constants";
import { getBiggestNumber, toHex, toWei } from "src/app/utils/helpers";
import ENV from "src/app/configs/env";
import { TxType } from "src/app/types/tx-type";

const ERC20ABI = require("src/app/configs/ABIs/ERC20.json");

const web3Provider = new Web3(new Web3.providers.HttpProvider(ENV.NODE.URL));

export function getDefaultGasLimitByType(txType: number): number {
  let defaultGas = 0;

  if (txType === ACTIONS.APPROVE) {
    defaultGas = DEFAULT_GAS_LIMIT.APPROVE;
  }

  return defaultGas;
}

export function getTxObjectByType(txType: number, params: any) {
  let txObject = null;

  if (txType === ACTIONS.APPROVE) {
    txObject = getApproveTxObject(
      params.address,
      params.tokenAddress,
      params.spender,
      params.isApproveToMax
    );
  }

  return txObject;
}

function getApproveTxObject(
  address: string,
  tokenAddress: string,
  spender: string,
  isApproveToMax: boolean,
  nonce?: string | number,
  gasPrice?: string | number,
  gas?: string | number
) {
  const allowanceAmount = isApproveToMax ? getBiggestNumber() : 0;
  const tokenContract = new web3Provider.eth.Contract(ERC20ABI, tokenAddress);
  const approveData = tokenContract.methods.approve(spender, allowanceAmount).encodeABI();

  return getTxObject(tokenAddress, approveData, address, nonce, gasPrice, gas);
}

function getTxObject(
  contractAddress: string,
  methodData: string,
  address: string,
  nonce?: string | number,
  gasPrice?: string | number,
  gas?: string | number
) {
  let txObject: TxType = {
    from: address,
    to: contractAddress,
    value: '0x0',
    data: methodData,
  };

  if (nonce !== undefined) txObject.nonce = toHex(nonce);
  if (gasPrice !== undefined) txObject.gasPrice = toHex(toWei(gasPrice));
  if (gas !== undefined) txObject.gas = toHex(gas);

  return txObject;
}