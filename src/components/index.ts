import dynamic from "next/dynamic";

export const Col = dynamic(() => import("./Box/Col"));
export const Row = dynamic(() => import("./Box/Row"));
export const Border = dynamic(() => import("./Border"));
export const Button = dynamic(() => import("./Button"));
export const Container = dynamic(() => import("./Container"));
export const DropDown = dynamic(() => import("./DropDown"));
export const Loading = dynamic(() => import("./Loading"));
export const Modal = dynamic(() => import("./Modal"));
export const Page = dynamic(() => import("./Page"));
export const Seo = dynamic(() => import("./Seo"));
export const Template = dynamic(() => import("./Template"));

export const WalletDropDown = dynamic(() => import("./DropDown/WalletDropDown"));
export const WalletConnectButton = dynamic(() => import("./Button/WalletConnectButton"));
export const WalletConnectModal = dynamic(() => import("./Modal/WalletConnectModal"));
export const CreateEscrowModal = dynamic(() => import("./Modal/CreateEscrowModal"));

export { default as Notification } from "./Notification";
