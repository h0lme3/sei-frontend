import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import { contractAddress, fee } from "./constants";
import { WalletInfoProps } from "./types";

export const executeContract = async (client: SigningCosmWasmClient, senderAddress: string, msg: unknown) => {
  await client.execute(senderAddress, contractAddress, msg, fee);
};

export const queryContract = async (client: SigningCosmWasmClient, msg: unknown) => {
  const response = await client.queryContractSmart(contractAddress, msg);
  return response;
};

export const shortenWalletAddress = (walletAddress: string, len: number = 5) => {
  return walletAddress.slice(0, len) + "..." + walletAddress.slice(-len);
};

export const getWalletInfo = () => {
  const storage = localStorage.getItem("walletInfo");
  if (storage === "undefined" || storage === null) return;
  const walletInfo: WalletInfoProps = JSON.parse(storage);
  return walletInfo;
};
