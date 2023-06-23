import { Coin } from "@cosmjs/amino";
import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import { Notification } from "components";
import { COUNTER, ESCROWS, TOKEN, counterAddress, escrowsAddress, fee, tokenAddress } from "./constants";

export const returnContractType = (contractType: string) => {
  switch (contractType) {
    case COUNTER:
      return counterAddress;
    case ESCROWS:
      return escrowsAddress;
    case TOKEN:
      return tokenAddress;
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
  const response = await client.execute(senderAddress, contractAddress, msg, fee, "", funds);
  return response;
};

export const queryContract = async (
  client: SigningCosmWasmClient | CosmWasmClient,
  msg: unknown,
  contractType: string
) => {
  const contractAddress = returnContractType(contractType);
  console.log(contractAddress, "contractAddress");
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
