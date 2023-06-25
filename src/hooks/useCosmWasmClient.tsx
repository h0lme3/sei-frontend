import { useState, useEffect } from "react";

import type { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { getCosmWasmClient } from "@sei-js/core";

import { rpcUrl } from "utils";

export const useCosmWasmClient = () => {
  const [client, setClient] = useState<CosmWasmClient>();

  useEffect(() => {
    (async () => {
      await getCosmWasmClient(rpcUrl).then(setClient);
    })();
  }, []);

  return { cosmWasmClient: client };
};

export default useCosmWasmClient;
