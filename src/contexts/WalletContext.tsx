import { createContext, useContext, useEffect, useState } from "react";
import type { FC, PropsWithChildren } from "react";

import { WalletConnect, connect } from "@sei-js/core";

import { WalletConnectModal } from "components";
import { chainId, getWalletInfo, handleErrors } from "utils";
import { WalletInfoProps } from "utils/types";

// create context
export const WalletContext = createContext({
  isLoading: false,
  setIsLoading: (value: boolean) => {},
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      const wallet = await connect(walletInfo.name, chainId);
      localStorage.setItem("walletInfo", JSON.stringify(walletInfo));
      setWallet(wallet);
      setWalletInfo(walletInfo);
      setSenderAddress(wallet.accounts[0].address);
    } catch (error) {
      handleErrors(error);
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
        isLoading,
        setIsLoading,
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
