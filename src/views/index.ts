import dynamic from "next/dynamic";

export const CounterView = dynamic(() => import("./CounterView"));
export const EscrowsView = dynamic(() => import("./EscrowsView"));
export const VaultView = dynamic(() => import("./VaultView"));
export const WeightedPoolView = dynamic(() => import("./WeightedPoolView"));
