import dynamic from "next/dynamic";

export const Col = dynamic(() => import("./Box/Col"));
export const Row = dynamic(() => import("./Box/Row"));

export const Button = dynamic(() => import("./Button"));

export const WalletDropDown = dynamic(() => import("./DropDown/WalletDropDown"));
export const WalletConnectButton = dynamic(() => import("./Button/WalletConnectButton"));
export const WalletConnectModal = dynamic(() => import("./Modal/WalletConnectModal"));

export { default as Notification } from "./Notification";
