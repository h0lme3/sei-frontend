import type { FC, PropsWithChildren } from "react";
import React from "react";

import { Button, WalletDropDown } from "components";
import { useWallet } from "contexts";
import type { ExtraTWClassProps } from "types";

const WalletConnectButton: FC<PropsWithChildren & ExtraTWClassProps> = ({ children, className = "" }) => {
  const { wallet, openWalletModal } = useWallet();

  return wallet ? (
    <WalletDropDown />
  ) : (
    <Button action={openWalletModal} className={className}>
      {children ? children : "Select Wallet"}
    </Button>
  );
};

export default WalletConnectButton;
