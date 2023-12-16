import React from "react";
import WalletModalHeader from "./WalletModalHeader";
import ConnectWalletModal from "./ConnectWalletModal";
import { useWalletConnect } from "../../context/WalletConnectProvider";
import WalletAccount from "./WalletAccount";

export default function WalletModal({
  show,
  onConfigClick,
  closeHandler,
  theme,
}) {
  const { senderPublicKey } = useWalletConnect();
  return show ? (
    <div data-testid="wallet-modal" className="sc-1hmbv05-0 jcIclM">
      <WalletModalHeader
        onConfigClick={onConfigClick}
        closeHandler={closeHandler}
        theme={theme}
      />
      {senderPublicKey ? <WalletAccount /> : <ConnectWalletModal />}
    </div>
  ) : null;
}
