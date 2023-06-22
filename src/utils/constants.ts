import bigInt from "big-integer";
import { coins } from "@cosmjs/amino";

import { SeoProps, WalletInfoProps } from "types";

export const chainId = process.env.NEXT_PUBLIC_CHAIN_ID as string;
export const restUrl = process.env.NEXT_PUBLIC_REST_URL as string;
export const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL as string;
export const counterContractAddress = process.env.NEXT_PUBLIC_COUNTER_ADDRESS as string;
export const escrowsContractAddress = process.env.NEXT_PUBLIC_ESCROWS_ADDRESS as string;

export const useiDecimal = 6;
export const COUNTER = "counter";
export const ESCROWS = "escrows";

export const ESCROW_AMOUNT = bigInt("100000000000000");
export const fee = {
  amount: coins(10000, "usei"), // amount: 10,000 - 0.1 sei
  gas: "200000", // gas: 200,000 - 0.004 sei
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
  { name: "counter", path: "/counter" },
  { name: "escrows", path: "/escrows" },
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
  escrows: {
    title: "SEI-ESCROW | SOLA-X",
    description: "Smart liquidity protocol powered by Solana.",
    image: "/preview/default.png",
    canonical: "escrows",
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
