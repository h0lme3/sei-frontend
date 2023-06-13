import type { MouseEventHandler } from "react";

import { WalletWindowKey } from "@sei-js/core";
import { StaticImageData } from "next/image";

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
