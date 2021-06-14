import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { clearAccount, importAccount } from "src/app/actions/accountAction";
import { MOBILE_SCREEN_SIZE, WALLET_TYPES } from "src/app/configs/constants";
import ENV from "src/app/configs/env";
import { getWalletParams, fromNetworkIdToName, checkIsMetamask } from "src/app/utils/helpers";
import { setGlobalMessage } from "src/app/actions/globalAction";
import DappService from "src/app/services/accounts/DappService";

export default function useSettingUpAccount() {
  const dispatch = useDispatch();
  const { address, wallet } = useSelector((state: any) => state.account);

  useEffect(() => {
    detectAndConnectToDapp();
    callSubscribeToDisconnect();
  }, []); // eslint-disable-line

  async function detectAndConnectToDapp() {
    const isMetamask = checkIsMetamask();
    const isMobile = window.innerWidth < MOBILE_SCREEN_SIZE;
    const isWeb3Imported = window.ethereum;

    /*** Check same address as previous one ****/
    if (address) {
      const currentAddr = await wallet.connect(openConnectErrorModal, openNetworkErrorModal);
      if (currentAddr !== address) dispatchClearAccount();
    }

    if (isWeb3Imported && (!isMetamask || isMobile)) {
      const walletParams = getWalletParams();
      const wallet = new DappService(walletParams);
      const address = await wallet.connect(openConnectErrorModal, openNetworkErrorModal);

      if (!address) return;

      dispatch(importAccount(address, wallet, WALLET_TYPES.DAPP));
    }
  }

  function callSubscribeToDisconnect() {
    if (wallet && typeof wallet.subscribeToDisconnect === 'function') {
      wallet.subscribeToDisconnect(dispatchClearAccount, dispatchImportAccount, wallet);
    }
  }

  function dispatchImportAccount(address: string, wallet: any, type: string) {
    dispatch(importAccount(address, wallet, type));
  }

  function dispatchClearAccount() {
    dispatch(clearAccount());
  }

  function openConnectErrorModal() {
    dispatch(setGlobalMessage(true, 'Error: Something went wrong connecting with your Metamask', 'error'));
  }

  function openNetworkErrorModal() {
    dispatch(setGlobalMessage(true, `Please make sure that your network is on ${fromNetworkIdToName(ENV.NETWORK_ID)}`, 'error'))
  }
}
