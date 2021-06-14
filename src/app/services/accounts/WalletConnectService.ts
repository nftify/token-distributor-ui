import WalletConnect from "@walletconnect/browser";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import { fromNetworkIdToName } from "src/app/utils/helpers";
import { WALLET_TYPES } from "src/app/configs/constants";
import BaseWalletService from "src/app/services/accounts/BaseWalletService";

export default class WalletConnectService extends BaseWalletService {
  walletConnector:any

  constructor(props?: any) {
    super(props);

    this.initiateWalletConnector();
  }

  initiateWalletConnector = () => {
    this.walletConnector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org"
    });
  }

  openQRCodeModal = async () => {
    if (this.walletConnector.connected) {
      await this.clearSession();
      this.initiateWalletConnector();
    }

    this.walletConnector.createSession().then(() => {
      const uri = this.walletConnector.uri;
      WalletConnectQRCodeModal.open(uri, null);
    });
  };

  getConnected = (importAccount: any, openErrorModal: any) => {
    this.walletConnector.on("connect", (error: any, payload: any) => {
      if (error) {
        openErrorModal(error.message);
        return;
      }

      WalletConnectQRCodeModal.close();

      const { accounts, chainId } = payload.params[0];

      if (chainId !== this.networkId) {
        const expectedNetwork = fromNetworkIdToName(this.networkId);

        this.clearSession();

        openErrorModal(`Please make sure that your network is on ${expectedNetwork}`);

        return;
      }

      importAccount(accounts[0]);
    });
  };

  getDisconnected = (clearAccount: any) => {
    this.walletConnector.on("disconnect", () => {
      this.handleClearAccount(clearAccount);
    });

    this.walletConnector.on("session_update", () => {
      this.handleClearAccount(clearAccount);
    });
  };

  handleClearAccount = (clearAccount: any) => {
    WalletConnectQRCodeModal.close();
    this.walletConnector = null;
    clearAccount();
  };

  clearSession = async () => {
    await this.walletConnector.killSession();
  };

  subscribeToDisconnect = (clearAccount: any) => {
    this.getDisconnected(clearAccount);
  };

  sendTransaction = (txObject: any) => {
    return new Promise((resolve, reject) => {
      this.walletConnector.sendTransaction(txObject).then((transactionHash: string) => {
        resolve(transactionHash);
      }).catch((err: any) => {
        reject(err.message);
      })
    })
  };

  getWalletType = () => {
    return WALLET_TYPES.WALLET_CONNECT;
  }
}