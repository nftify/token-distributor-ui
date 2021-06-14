import React from 'react';
import { useDispatch } from "react-redux";
import WalletConnectService from "src/app/services/accounts/WalletConnectService";
import { clearAccount, importAccount } from "src/app/actions/accountAction";
import { WALLET_TYPES } from "src/app/configs/constants";
import { modalService } from "src/app/components/commons/ModalListener";
import BasicModalContent from "src/app/components/commons/BasicModalContent";
import { getWalletParams } from "src/app/utils/helpers";

export default function WalletConnectAccount(props: any) {
  const dispatch = useDispatch();

  async function connect() {
    const props = getWalletParams();
    const wallet = new WalletConnectService(props);

    await wallet.openQRCodeModal();

    wallet.getConnected(
      (address: string) => {
        dispatch(importAccount(address, wallet, WALLET_TYPES.WALLET_CONNECT));
        modalService.close();
      },
      (errorMessage: string) => openErrorModal(errorMessage)
    );

    wallet.getDisconnected(
      () => dispatch(clearAccount())
    );
  }

  function openErrorModal(errorMessage: string) {
    modalService.show(BasicModalContent, {
      title: "Error",
      content: <div>{errorMessage}</div>
    });
  }

  return (
    <div className={`account__item ${props.className}`} onClick={connect}>
      <div className="account__icon wallet-connect"/>
      <div className="account__name">Connect</div>
    </div>
  )
};
