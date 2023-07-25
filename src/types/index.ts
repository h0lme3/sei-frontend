import type { FC, MouseEventHandler, PropsWithChildren } from "react";
import type { StaticImageData } from "next/image";

import type { WalletWindowKey } from "@sei-js/core";

export type { FC };

export interface ExtraTWClassProps {
  className?: string;
}

export type ComponentProps = PropsWithChildren<ExtraTWClassProps>;

export interface ButtonProps extends ComponentProps {
  action?: MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
  disabled?: boolean;
  isLoading?: boolean;
  type?: "button" | "reset" | "submit" | undefined;
}

export interface PageProps extends PropsWithChildren {
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

export interface PoolsDetailsProps {
  id: number;
}

export interface VaultDetailsProps {
  admin: string;
  arbitrageur: string;
  beneficiary: string;
  delegator: string;
  uis_active: boolean;
  pool_stable_authority: string;
  pool_weighted_authority: string;
}

export interface TokenDetailProps {
  name: string;
  symbol: string;
  decimals: number;
  total_supply: number;
}

export interface WalletConnectModalProps {
  connectWallet: (walletTypeId: number) => void;
}
