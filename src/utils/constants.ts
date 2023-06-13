import { coins } from "@cosmjs/amino";

import { SeoProps, WalletInfoProps } from "types";

// const type = Router.asPath.substring(1);
// console.log(type, "type");

export const chainId = "atlantic-2";
export const restUrl = "https://rest.atlantic-2.seinetwork.io/";
export const rpcUrl = "https://rpc.atlantic-2.seinetwork.io/";
export const counterContractAddress = "sei17hw0c30az6vmqh3tu0x9p4gwn939ymfzrxgyz220kuk0pu07unkqvjft2q";
export const escrowContractAddress = "sei1592z9m5q2hm7gn5rdeyfj2393km3ehgttqn7gfwvdcgkpmp8e9wqzsg2sn";

export const COUNTER = "counter";
export const ESCROW = "escrow";

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

export const MENU_LIST = [
  { name: "counter", path: "/" },
  { name: "escrow", path: "/escrow" },
];

export const SEO_LIST: { [unknown: string]: SeoProps } = {
  default: {
    title: "SEI | SOLA-X",
    description: "Smart liquidity protocol powered by Solana.",
    image: "/preview/default.png",
    canonical: "default",
  },
  counter: {
    title: "SEI-Counter | SOLA-X",
    description: "Smart liquidity protocol powered by Solana.",
    image: "/preview/default.png",
    canonical: "counter",
  },
  escrow: {
    title: "SEI-ESCROW | SOLA-X",
    description: "Smart liquidity protocol powered by Solana.",
    image: "/preview/default.png",
    canonical: "escrow",
  },
  404: {
    title: "404 | Page Not Found",
    description: "Smart liquidity protocol powered by Solana.",
    image: "/preview/default.png",
    canonical: "404",
  },
  500: {
    title: "500 | Server Error",
    description: "Smart liquidity protocol powered by Solana.",
    image: "/preview/default.png",
    canonical: "500",
  },
};
