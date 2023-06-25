import { useState, useEffect } from "react";

import type { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { getSigningCosmWasmClient } from "@sei-js/core";

import { useWallet } from "contexts";
import { rpcUrl } from "utils";

export const useSigningCosmWasmClient = () => {
  const { wallet } = useWallet();

  const [client, setClient] = useState<SigningCosmWasmClient>();

  useEffect(() => {
    if (wallet) {
      (async () => {
        await getSigningCosmWasmClient(rpcUrl, wallet?.offlineSigner).then(setClient);
      })();
    }
  }, [wallet]);

  return { signingCosmWasmClient: client };
};

export default useSigningCosmWasmClient;
