import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import { contractAddress, fee } from "./constants";

export const executeContract = async (client: SigningCosmWasmClient, senderAddress: string, msg: unknown) => {
  await client.execute(senderAddress, contractAddress, msg, fee);
};

export const queryContract = async (client: SigningCosmWasmClient, msg: unknown) => {
  const response = await client.queryContractSmart(contractAddress, msg);
  return response;
};
