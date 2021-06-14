import Web3 from "web3";
import { fromNetworkIdToName } from "src/app/utils/helpers";

export default class BaseWalletService {
  ethereum: any
  address: string | null
  nodeUrl: string
  networkId: number
  chainName: string
  web3: any
  needTobeInitiated: any

  constructor(props: any) {
    this.ethereum = null;
    this.address = props?.address;
    this.nodeUrl = props?.nodeUrl;
    this.networkId = props?.networkId;
    this.chainName = props?.chainName;
    this.web3 = new Web3(new Web3.providers.HttpProvider(this.nodeUrl));
  }

  connect = async (onEthereumError: any = null, onNetworkError: any = null) => {
    if (!this.web3 && !this.ethereum) {
      this._returnEthereumError(onEthereumError, 'Error: Something went wrong connecting with your Metamask');
      return false;
    }

    const currentNetworkId = await this._getCurrentNetworkId();

    if (!currentNetworkId) {
      this._returnEthereumError(onEthereumError, 'Error: Cannot find current network ID');
      return false;
    } else if (currentNetworkId !== this.networkId) {
      if (typeof onNetworkError === 'function') onNetworkError(currentNetworkId);
      return false
    }

    this.address = await this._requestAccounts();

    if (!this.address) {
      this._returnEthereumError(onEthereumError, 'Error: Cannot find any available addresses');
      return false;
    }

    return this.address;
  };

  getDisconnected = (clearAccount?: any, importAccount?: any, wallet?: any) => {
    this._throwErrorOnNetworkError(clearAccount);

    this.ethereum.on('accountsChanged', async (accounts: any) => {
      if (accounts[0] === this.address) return;

      this.address = await this._requestAccounts();
      wallet.address = this.address;
      importAccount(this.address, wallet, wallet.getWalletType());
    });

    this.ethereum.on('chainChanged', (networkId: any) => {
      if (+networkId === this.networkId) return;
      clearAccount();
    });
  };

  makeTransaction = async (txObject: any, privateKey: string, devicePath: string) => {
    try {
      let txHash;

      await this._throwErrorOnNetworkError(null);

      if (privateKey) {
        const signedTxObj: any = await this.signTransaction(txObject, privateKey);
        txHash = await this.sendSignedTransaction(signedTxObj.rawTransaction);
      } else if (devicePath) {
        const signedRawTx: any = await this.signTransaction(txObject, devicePath);
        txHash = await this.sendSignedTransaction(signedRawTx);
      } else {
        txHash = await this.sendTransaction(txObject);
      }

      return txHash;
    } catch (error) {
      throw Error(error);
    }
  };

  sendTransaction = (txObject: any) => {
    return new Promise((resolve, reject) => {
      this.web3.eth.sendTransaction(txObject, function (err: any, txHash: string) {
        if (!err) {
          resolve(txHash);
        } else {
          let errorMessage = err.message;

          if (err.code === -32602) {
            errorMessage = 'Your current address is different from your previously imported one. Please re-import your address to make the transaction.';
          } else if (err.code === 4100) {
            errorMessage = 'You are not authorized to interact with this address. Please re-import your address to make the transaction.';
          }

          reject(errorMessage);
        }
      })
    })
  };

  signTransaction = (txObject: any, privateKey: string) => {
    return new Promise((resolve, reject) => {
      this.web3.eth.accounts.signTransaction(txObject, privateKey, function (err: any, signedTxObj: any) {
        if (!err) {
          resolve(signedTxObj);
        } else {
          reject(err.message);
        }
      })
    })
  };

  sendSignedTransaction = (rawTx: string) => {
    return new Promise((resolve, reject) => {
      this.web3.eth.sendSignedTransaction(rawTx, function (err: any, txHash: string) {
        if (!err) {
          resolve(txHash);
        } else {
          reject(err.message);
        }
      })
    })
  };

  _throwErrorOnNetworkError = async (actionOnError?: any) => {
    const currentNetworkId = await this._getCurrentNetworkId();
    if (!currentNetworkId || +currentNetworkId !== this.networkId) {
      if (actionOnError) {
        actionOnError();
      } else {
        throw Error(`Please make sure your network is on ${fromNetworkIdToName(this.networkId)}`);
      }
    }
  }

  _getCurrentNetworkId = async () => {
    let currentNetworkId;

    if (this.web3) {
      currentNetworkId = await this.web3.eth.net.getId();
    } else {
      currentNetworkId = this.ethereum.networkVersion;
    }

    return currentNetworkId;
  };

  _requestAccounts = async () => {
    let accounts;

    if (this.ethereum) {
      accounts = await this.ethereum.send('eth_requestAccounts');
    } else {
      accounts = await this.web3.eth.getAccounts();
    }

    const legacyAccount = accounts[0];
    const newAccount = accounts.result ? accounts.result[0] : null;

    return legacyAccount ? legacyAccount : newAccount;
  };

  _returnEthereumError = (onEthereumError: any, message: string) => {
    if (typeof onEthereumError === 'function') onEthereumError(message);
  }
}