import { TxType } from "src/app/types/tx-type";
import { detectWeb3Object } from "src/app/utils/helpers";
const TokenLockerABI = require("src/app/configs/ABIs/TokenLocker.json");

const { web3 } = detectWeb3Object();
const tokenLockerContract = new web3.eth.Contract(TokenLockerABI);

export async function fetchLockedAmount(address: string, contract: string): Promise<number> {
  tokenLockerContract.options.address = contract;

  const amount = await tokenLockerContract.methods.lockOf(address).call();

  return +amount;
}

export async function fetchClaimableAmount(address: string, contract: string): Promise<number> {
  tokenLockerContract.options.address = contract;

  const amount = await tokenLockerContract.methods.canUnlockAmount(address).call();

  return +amount;
}

export async function fetchFirstUnlockAmount(totalAmount: string, contract: string): Promise<number> {
  tokenLockerContract.options.address = contract;

  const amount = await tokenLockerContract.methods.firstUnlockAmount(totalAmount).call();

  return +amount;
}

export async function fetchReleasedAmount(address: string, contract: string): Promise<number> {
  tokenLockerContract.options.address = contract;

  const amount = await tokenLockerContract.methods.released(address).call();

  return +amount;
}

export function getFirstUnlockTxObject(
  address: string,
  index: number,
  account: string,
  amount: number,
  merkleProof: any,
  contract: string
): TxType {
  const firstUnlockData = tokenLockerContract.methods.firstUnlock(index, account, amount, merkleProof).encodeABI();
  return _getTxObject(address, contract, firstUnlockData);
}

export function getUnlockTxObject(address: string, account: string, contract: string): TxType {
  const unlockData = tokenLockerContract.methods.unlock(account).encodeABI();
  return _getTxObject(address, contract, unlockData);
}

function _getTxObject(address: string, contract: string, methodData: string): TxType {
  return {
    from: address,
    to: contract,
    value: '0x0',
    data: methodData,
  };
}