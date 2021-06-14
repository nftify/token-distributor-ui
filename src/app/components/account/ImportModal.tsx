import React from "react";
import MetamaskAccount from "src/app/components/account/MetamaskAccount";
// import WalletLinkAccount from "src/app/components/account/WalletLinkAccount";
// import WalletConnectAccount from "src/app/components/account/WalletConnectAccount";
import BasicModalContent from "src/app/components/commons/BasicModalContent";

export default function ImportModal() {
  return (
    <BasicModalContent
      customTitle="Import your Wallet"
      noPanel={true}
      content={(
        <div className="account">
          <MetamaskAccount/>
          {/* <WalletConnectAccount/> */}
          {/* <WalletLinkAccount/> */}
        </div>
      )}
    />
  )
}