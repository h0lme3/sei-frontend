import { coins } from "@cosmjs/amino";

export const chainId = "atlantic-2";
export const rpcEndpoint = "https://rpc.atlantic-2.seinetwork.io/";
export const contractAddress = "sei17hw0c30az6vmqh3tu0x9p4gwn939ymfzrxgyz220kuk0pu07unkqvjft2q";

export const fee = {
  amount: coins(10000, "usei"), // amount: 10,000
  gas: "200000", // gas: 200,000
};
