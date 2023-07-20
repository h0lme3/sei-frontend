// import bigInt from "big-integer";
import { coins } from "@cosmjs/amino";

import { SeoProps, WalletInfoProps } from "types";

export const chainId = process.env.NEXT_PUBLIC_CHAIN_ID as string;
export const restUrl = process.env.NEXT_PUBLIC_REST_URL as string;
export const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL as string;

export const COUNTER_ADDRESS = process.env.NEXT_PUBLIC_COUNTER_ADDRESS as string;
export const ESCROWS_ADDRESS = process.env.NEXT_PUBLIC_ESCROWS_ADDRESS as string;
export const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS as string;
export const WEIGHT_POOL_ADDRESS = process.env.NEXT_PUBLIC_WEIGHT_POOL_ADDRESS as string;
export const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as string;

export const FLOAT_NUM_REGEX = "/^[+-]?d+(.d+)?$/";

export const USEI_DECIMALS = 6;

export const ESCROW_RADIO = ["sei-cw20", "cw20-sei"];

// export const ESCROW_AMOUNT = bigInt("100000000000000"); // 1e14
// export const ESCROW_AMOUNT = bigInt("1000000000000000000"); // 1e18

export const FEE = {
  amount: coins(10000, "usei"), // amount: 10,000 - 0.1 sei
  gas: "300000", // gas: 300,000 - 0.006 sei
};

export const WALLET_LIST: WalletInfoProps[] = [
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
  { name: "vault", path: "/vault" },
  { name: "weight pool", path: "/weight-pool" },
];

export const SEO_LIST: { [unknown: string]: SeoProps } = {
  default: {
    title: "Home",
    description: "Smart liquidity protocol powered by Solana.",
    image: "/preview/default.png",
    canonical: "default",
  },
  counter: {
    title: "Counter | SOLA-X",
    description: "Smart liquidity protocol powered by Solana.",
    image: "/preview/default.png",
    canonical: "counter",
  },
  escrows: {
    title: "Escrows | SOLA-X",
    description: "Smart liquidity protocol powered by Solana.",
    image: "/preview/default.png",
    canonical: "escrows",
  },
  vault: {
    title: "Vault | SOLA-X",
    description: "Smart liquidity protocol powered by Solana.",
    image: "/preview/default.png",
    canonical: "vault",
  },
  weight_pool: {
    title: "Weight Pool | SOLA-X",
    description: "Smart liquidity protocol powered by Solana.",
    image: "/preview/default.png",
    canonical: "weight-pool",
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
