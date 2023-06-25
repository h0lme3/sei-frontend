import { Coin } from "@cosmjs/amino";
import type { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import { Notification } from "components";
import { fee } from "./constants";

export const executeContract = async (
  client: SigningCosmWasmClient,
  senderAddress: string,
  msg: unknown,
  contractAddress: string,
  funds?: Coin[]
) => {
  const response = await client.execute(senderAddress, contractAddress, msg, fee, "", funds);
  return response;
};

export const queryContract = async (client: CosmWasmClient, msg: unknown, contractAddress: string) => {
  const response = await client.queryContractSmart(contractAddress, msg);
  return response;
};

export const shortenWalletAddress = (walletAddress: string, len = 4) => {
  return walletAddress.slice(0, len) + "..." + walletAddress.slice(-len);
};

export const getWalletId = () => {
  const storage = localStorage.getItem("walletId");
  if (storage === "undefined" || storage === null) return;
  const walletId = JSON.parse(storage);
  return walletId;
};

export const handleErrors = (error: any) => {
  console.log(error, "error");
  const message = error.message;
  Notification({ type: "error", title: "Transaction failed", message });
};

export const handleSuccess = (response: any) => {
  console.log(response, "response");
  // const link = `https://sei.explorers.guru/transaction/${response.transactionHash}`;
  const link = `https://testnet-explorer.brocha.in/sei%20atlantic%202/tx/${response.transactionHash}`;
  Notification({ type: "success", title: "Transaction ", message: "Transaction is confirmed successfully", link });
};
