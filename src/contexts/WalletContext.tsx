import { createContext, useContext, useEffect, useState } from "react";
import type { FC, PropsWithChildren } from "react";

import { WalletConnect, connect } from "@sei-js/core";

import { WalletConnectModal } from "components";
import { chainId, getWalletInfo } from "utils";
import { WalletInfoProps } from "utils/types";

// create context
export const WalletContext = createContext({
  senderAddress: "",
  isWalletModalOpen: false,
  walletInfo: undefined as WalletInfoProps | undefined,
  wallet: null as WalletConnect | null,
  openWalletModal: () => {},
  closeWalletModal: () => {},
  disconnectWallet: () => {},
});

export interface WalletProviderProps extends PropsWithChildren {
  autoConnect: boolean;
}

export const WalletProvider: FC<WalletProviderProps> = ({ children, autoConnect = false }) => {
  const [senderAddress, setSenderAddress] = useState<string>("");
  const [wallet, setWallet] = useState<WalletConnect | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfoProps | undefined>(undefined);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const openWalletModal = () => setIsWalletModalOpen(true);
  const closeWalletModal = () => setIsWalletModalOpen(false);

  useEffect(() => {
    autoConnect && autoConnectWallet();
  }, [autoConnect]);

  const autoConnectWallet = async () => {
    const walletInfo = getWalletInfo();
    walletInfo && connectWallet(walletInfo);
  };

  const connectWallet = async (walletInfo: WalletInfoProps) => {
    try {
      setWalletInfo(walletInfo);
      localStorage.setItem("walletInfo", JSON.stringify(walletInfo));
      const wallet = await connect(walletInfo.name, chainId);
      setWallet(wallet);
      setSenderAddress(wallet.accounts[0].address);
    } catch (error) {
      console.error(error, "error");
    } finally {
      closeWalletModal();
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
  };

  return (
    <WalletContext.Provider
      value={{
        senderAddress,
        wallet,
        walletInfo,
        isWalletModalOpen,
        openWalletModal,
        closeWalletModal,
        disconnectWallet,
      }}
    >
      {children}
      <WalletConnectModal connectWallet={connectWallet} />
    </WalletContext.Provider>
  );
};

// use context
export const useWallet = () => {
  return useContext(WalletContext);
};

export default WalletProvider;
