import type { MouseEventHandler } from "react";

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

export interface WalletInfoProps {
  name: WalletWindowKey;
  src: any;
}
