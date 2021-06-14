import ENV from "src/app/configs/env";
import { WALLET_TYPES } from "src/app/configs/constants";
import MetamaskService from "src/app/services/accounts/MetamaskService";
import WalletConnectService from "src/app/services/accounts/WalletConnectService";
import DappService from "src/app/services/accounts/DappService";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import WalletLinkService from "src/app/services/accounts/WalletLinkService";

export function getAnimatedJsonOptions(json: any) {
  return {
    loop: true,
    autoplay: true,
    animationData: json.default,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }
}

export function getWalletParams(address?: string) {
  return {
    nodeUrl: ENV.NODE.URL,
    nodeTimeout: ENV.NODE.CONNECTION_TIMEOUT,
    networkId: ENV.NETWORK_ID,
    chainName: ENV.CHAIN_NAME,
    address: address,
  }
}

export function detectWeb3Object() {
  let web3;
  const ethereum = window.ethereum;

  if (ethereum) {
    web3 = new Web3(ethereum as any);
  } else {
    const provider = new Web3.providers.HttpProvider(ENV.NODE.URL)
    web3 = new Web3(provider);
  }

  return {web3, ethereum}
}

export function getWalletByType(address: string, type: string) {
  let wallet = null;
  const props = getWalletParams(address);

  if (type === WALLET_TYPES.METAMASK) {
    wallet = new MetamaskService(props);
  } else if (type === WALLET_TYPES.WALLET_CONNECT) {
    wallet = new WalletConnectService(props);
  } else if (type === WALLET_TYPES.WALLET_LINK) {
    wallet = new WalletLinkService(props);
  } else if (type === WALLET_TYPES.DAPP) {
    wallet = new DappService(props);
  }

  return wallet;
}

export function fromNetworkIdToName(networkId: number) {
  let networkName = 'Unknown Network';

  if (networkId === 1) {
    networkName = 'Mainnet';
  } else if (networkId === 3) {
    networkName = 'Ropsten';
  } else if (networkId === 4) {
    networkName = 'Rinkeby';
  } else if (networkId === 5) {
    networkName = 'Goerli Test';
  } else if (networkId === 42) {
    networkName = 'Kovan';
  } else if (networkId === 97) {
    networkName = 'BSC testnet';
  } else if (networkId === 56) {
    networkName = 'BSC mainnet';
  }

  return networkName;
}

export function getBiggestNumber() {
  return '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
}

export function checkIsMetamask() {
  let isMetamask = false;

  if (window.ethereum && window.ethereum.isMetaMask) {
    isMetamask = true;
  }

  return isMetamask;
}

export function formatBigNumber(number: number | string, decimals = 18) {
  if (!number) return 0;

  const bigNumber = new BigNumber(number.toString());
  const result = bigNumber.div(Math.pow(10, decimals));

  return result.toString();
}

export function roundNumber(number: number | string, precision = 6, isFormatted = false) {
  if (!number) return 0;

  const amountBigNumber = new BigNumber(number);
  const amountString = amountBigNumber.toFixed().toString();
  const indexOfDecimal = amountString.indexOf('.');
  const roundedNumber = indexOfDecimal !== -1 ? amountString.slice(0, indexOfDecimal + (precision + 1)) : amountString;

  return isFormatted ? displayFormattedNumber(roundedNumber, precision) : roundedNumber;
}

export function displayFormattedNumber(number: any, precision = 0) {
  if (!number) return 0;
  if (number > 0 && number < 1) return +(+number).toFixed(6);

  let bigNumber = new BigNumber(number);
  let formattedNumber = bigNumber.toFormat(precision);
  const numberParts = formattedNumber.split('.');

  if (numberParts.length === 2 && !+numberParts[1]) {
    formattedNumber = numberParts[0];
  }

  return formattedNumber;
}

export function formatAddress(address: string, first = 10, last = -4) {
  if (!address) return '';
  return `${address.slice(0, first)}...${address.slice(last)}`;
}

export function isAddress(address: string) {
  return Web3.utils.isAddress(address);
}

export function toGwei(number: number | string) {
  const bigNumber = new BigNumber(number.toString());
  return bigNumber.div(1000000000).toString();
}

export function toWei(number: number | string) {
  return toBigAmount(number, 9);
}

export function toBigAmount(number: number | string, decimal = 18) {
  const bigNumber = new BigNumber(number.toString());
  return bigNumber.times(Math.pow(10, decimal)).toFixed(0)
}

export function multiplyOfTwoNumber(firstNumber: number | string, secondNumber: number | string) {
  const firstBigNumber = new BigNumber(firstNumber);
  const secondBigNumber = new BigNumber(secondNumber);

  return firstBigNumber.multipliedBy(secondBigNumber).toString();
}

export function calculateTxFee(gasPrice: number | string, gasLimit: number | string, precision = 7) {
  return roundNumber(multiplyOfTwoNumber(toGwei(gasPrice), gasLimit), precision);
}

export function toHex(number: string | number) {
  const bigNumber = new BigNumber(number);
  return "0x" + bigNumber.toString(16);
}