import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { WalletConnect, connect } from "@sei-js/core";

import { useMain } from "./MainContext";
import { WalletConnectModal } from "components";
import { chainId, getWalletId, handleErrors, WALLET_LIST } from "utils";

// create context
export const WalletContext = createContext({
  senderAddress: "",
  isWalletModalOpen: false,
  walletId: 0,
  wallet: null as WalletConnect | null,
  openWalletModal: (value: string) => {
    value;
  },
  closeWalletModal: () => {},
  disconnectWallet: () => {},
});

export interface WalletProviderProps extends PropsWithChildren {
  autoConnect: boolean;
}

export const WalletProvider: FC<WalletProviderProps> = ({ children, autoConnect = false }) => {
  const { modalType, setModalType } = useMain();
  const [senderAddress, setSenderAddress] = useState<string>("");
  const [wallet, setWallet] = useState<WalletConnect | null>(null);
  const [walletId, setWalletId] = useState<number>(0);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  useEffect(() => {
    autoConnect && autoConnectWallet();
  }, [autoConnect]);

  const autoConnectWallet = async () => {
    const walletId = getWalletId();
    walletId && connectWallet(walletId);
  };

  const connectWallet = async (walletId: number) => {
    try {
      const wallet = await connect(WALLET_LIST[walletId - 1].name, chainId);
      localStorage.setItem("walletId", JSON.stringify(walletId));
      setWallet(wallet);
      setWalletId(walletId);
      setSenderAddress(wallet.accounts[0].address);
    } catch (error) {
      handleErrors(error);
    } finally {
      closeWalletModal();
    }
  };

  const openWalletModal = (type: string) => {
    setIsWalletModalOpen(true);
    setModalType(type);
  };
  const closeWalletModal = () => setIsWalletModalOpen(false);
  const disconnectWallet = () => {
    setWallet(null);
    localStorage.removeItem("walletId");
  };

  return (
    <WalletContext.Provider
      value={{
        senderAddress,
        wallet,
        walletId,
        isWalletModalOpen,
        openWalletModal,
        closeWalletModal,
        disconnectWallet,
      }}
    >
      {children}
      {modalType === "wallet_connect" && <WalletConnectModal connectWallet={connectWallet} />}
    </WalletContext.Provider>
  );
};

// use context
export const useWallet = () => {
  return useContext(WalletContext);
};

export default WalletProvider;
