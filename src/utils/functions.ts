import { Coin } from "@cosmjs/amino";
import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import { Notification } from "components";
import { COUNTER, ESCROWS, counterContractAddress, escrowsContractAddress, fee } from "./constants";
import type { WalletInfoProps } from "types";

export const returnContractType = (contractType: string) => {
  switch (contractType) {
    case COUNTER:
      return counterContractAddress;
    case ESCROWS:
      return escrowsContractAddress;
    default:
      throw new Error(`Contract type ${contractType} is not supported.`);
  }
};

export const executeContract = async (
  client: SigningCosmWasmClient,
  senderAddress: string,
  msg: unknown,
  contractType: string,
  funds?: Coin[]
) => {
  const contractAddress = returnContractType(contractType);
  await client.execute(senderAddress, contractAddress, msg, fee, "", funds);
};

export const queryContract = async (
  client: SigningCosmWasmClient | CosmWasmClient,
  msg: unknown,
  contractType: string
) => {
  const contractAddress = returnContractType(contractType);
  const response = await client.queryContractSmart(contractAddress, msg);
  return response;
};

export const shortenWalletAddress = (walletAddress: string, len = 5) => {
  return walletAddress.slice(0, len) + "..." + walletAddress.slice(-len);
};

export const getWalletInfo = () => {
  const storage = localStorage.getItem("walletInfo");
  if (storage === "undefined" || storage === null) return;
  const walletInfo: WalletInfoProps = JSON.parse(storage);
  return walletInfo;
};

export const handleErrors = (error: any) => {
  console.log(error, "error");
  const message = error.message;
  Notification({ type: "error", title: "Transaction failed", message });
};

export const handleSuccess = (response: any) => {
  console.log(response, "response");
  const link = "https://sei.explorers.guru/";
  Notification({ type: "success", title: "Transaction ", message: "Transaction is confirmed successfully", link });
};
