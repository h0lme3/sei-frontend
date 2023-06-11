import { coins } from "@cosmjs/amino";

import { WalletInfoProps } from "./types";

export const chainId = "atlantic-2";
export const restUrl = "https://rest.atlantic-2.seinetwork.io/";
export const rpcUrl = "https://rpc.atlantic-2.seinetwork.io/";
export const contractAddress = "sei17hw0c30az6vmqh3tu0x9p4gwn939ymfzrxgyz220kuk0pu07unkqvjft2q";

export const fee = {
  amount: coins(10000, "usei"), // amount: 10,000
  gas: "200000", // gas: 200,000
};

export const wallets: WalletInfoProps[] = [
  { name: "leap", src: require("assets/leap.png") },
  { name: "keplr", src: require("assets/keplr.png") },
  { name: "fin", src: require("assets/fin.png") },
  { name: "compass", src: require("assets/compass.png") },
  { name: "falcon", src: require("assets/falcon.png") },
  { name: "coin98", src: require("assets/coin98.png") },
];
