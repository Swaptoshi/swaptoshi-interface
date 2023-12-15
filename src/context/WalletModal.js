import React, { useState } from "react";

const WalletModalContext = React.createContext();

export function useWalletModal() {
  return React.useContext(WalletModalContext);
}

export default function WalletModalProvider({ children }) {
  const [walletOpen, setwalletOpen] = useState();

  const context = React.useMemo(
    () => [walletOpen, setwalletOpen],
    [walletOpen]
  );

  return (
    <WalletModalContext.Provider value={context}>
      {children}
    </WalletModalContext.Provider>
  );
}
