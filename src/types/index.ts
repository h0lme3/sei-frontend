import type { MouseEventHandler } from "react";
import { StaticImageData } from "next/image";

import { WalletWindowKey } from "@sei-js/core";

export interface ExtraTWClassProps {
  className?: string;
}

export interface ButtonProps {
  action?: MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
  disabled?: boolean;
  isLoading?: boolean;
  type?: "button" | "reset" | "submit" | undefined;
}

export interface PageProps {
  name: string;
}

export interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
}

export interface WalletInfoProps {
  name: WalletWindowKey;
  src: StaticImageData | string;
}

export interface NotificationProps {
  type?: string;
  title: string;
  message: string;
  link?: string;
}

export interface EscrowsDetailsProps {
  id: number;
  owner: string;
  is_cancelled: boolean;
  is_complete: boolean;
  is_coin_escrow: boolean;
  coin_amount: number;
  token_amount: string;
  token_address: string;
  balance: {
    cw20: Array<number>;
    native: Array<{ demo: string; amount: string }>;
  };
}

export interface TokenDetailProps {
  name: string;
  symbol: string;
  decimals: number;
  total_supply: number;
}
