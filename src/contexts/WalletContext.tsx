import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { WalletConnect, connect, getCosmWasmClient, getSigningCosmWasmClient } from "@sei-js/core";

import { WalletConnectModal } from "components";
import { chainId, handleErrors, rpcUrl, wallets } from "utils";

// create context
export const WalletContext = createContext({
  senderAddress: "",
  isWalletModalOpen: false,
  walletId: 0,
  wallet: null as WalletConnect | null,
  client: null as SigningCosmWasmClient | null,
  getClient: async (): Promise<CosmWasmClient> => {
    return await getCosmWasmClient(rpcUrl);
  },
  openWalletModal: () => {},
  closeWalletModal: () => {},
  disconnectWallet: () => {},
});

export interface WalletProviderProps extends PropsWithChildren {
  autoConnect: boolean;
}

export const WalletProvider: FC<WalletProviderProps> = ({ children, autoConnect = false }) => {
  const [senderAddress, setSenderAddress] = useState<string>("");
  const [client, setClient] = useState<SigningCosmWasmClient | null>(null);
  const [wallet, setWallet] = useState<WalletConnect | null>(null);
  const [walletId, setWalletId] = useState<number>(0);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  useEffect(() => {
    autoConnect && autoConnectWallet();
  }, [autoConnect]);

  const getClient = useMemo(
    () => async () => {
      if (!wallet) {
        return await getCosmWasmClient(rpcUrl);
      }
      const client = await getSigningCosmWasmClient(rpcUrl, wallet.offlineSigner);
      setClient(client);
      return client;
    },
    [wallet, rpcUrl]
  );

  const autoConnectWallet = async () => {
    const storage = localStorage.getItem("walletId");
    if (storage === "undefined" || storage === null) return;
    const walletId = JSON.parse(storage);
    console.log(walletId, "walletId-autoconnectwallet");
    connectWallet(walletId);
  };

  const connectWallet = async (walletId: number) => {
    try {
      console.log(walletId, "walletId-connectwallet");
      const wallet = await connect(wallets[walletId - 1].name, chainId);
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

  const openWalletModal = () => setIsWalletModalOpen(true);
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
        client,
        getClient,
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
