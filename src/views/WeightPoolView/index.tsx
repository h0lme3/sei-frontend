import React, { memo, useEffect } from "react";

// import bigInt from "big-integer";
// import type { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import { Button, Container } from "components";
import { useMain, useWallet } from "contexts";
import { useCosmWasmClient, useSigningCosmWasmClient } from "hooks";
import {
  COUNTER_ADDRESS,
  ESCROWS_ADDRESS,
  // TOKEN_ADDRESS,
  executeContract,
  handleErrors,
  handleSuccess,
  queryContract,
} from "utils";
// import type { EscrowsDetailsProps } from "types";

const WeightPoolView = () => {
  const { isLoading, setIsLoading, buttonType, setButtonType } = useMain();
  const { senderAddress } = useWallet();
  const { cosmWasmClient } = useCosmWasmClient();
  const { signingCosmWasmClient } = useSigningCosmWasmClient();

  // const [escrowsDetails, setEscrowsDetails] = useState<EscrowsDetailsProps[]>([]);

  useEffect(() => {
    fetchWeightPoolList();
  }, [cosmWasmClient]);

  // const getWeightPoolDetailsByID = async (cosmWasmClient: CosmWasmClient, id: number): Promise<EscrowsDetailsProps> => {
  //   const msg = { details: { id } };
  //   const response = await queryContract(cosmWasmClient, msg, ESCROWS_ADDRESS);
  //   return response;
  // };

  const fetchWeightPoolList = async () => {
    if (!cosmWasmClient) return;
    try {
      setIsLoading(true);
      const msg = { list: {} };
      const response = await queryContract(cosmWasmClient, msg, ESCROWS_ADDRESS);
      console.log(response, "response");
      // const escrowsIds: number[] = escrows.map((escrow: Pick<EscrowsDetailsProps, "id">) => escrow.id);
      // const escrowsDetails = await Promise.all(
      //   escrowsIds.map((escrow, index) => getWeightPoolDetailsByID(cosmWasmClient, index + 1))
      // );
      // setEscrowsDetails(escrowsDetails);
    } catch (error) {
      handleErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (type: string) => {
    if (!signingCosmWasmClient || !senderAddress) return;
    try {
      setButtonType(type);
      setIsLoading(true);
      let msg;
      if (type === "initialize") {
        msg = { initialize: {} };
      }
      if (type === "close") {
        msg = { close: { pool_id: 0 } };
      }
      if (type === "add_liquidity") {
        msg = { add_liquidity: {} };
      }
      if (type === "remove_liquidity") {
        msg = { remove_liquidity: {} };
      }
      if (type === "swap") {
        msg = { swap: {} };
      }
      const response = await executeContract(signingCosmWasmClient, senderAddress, msg, COUNTER_ADDRESS);
      handleSuccess(response);
    } catch (error) {
      handleErrors(error);
    } finally {
      await fetchWeightPoolList();
    }
  };

  return (
    <Container>
      <Button action={() => handleWithdraw("initialize")} isLoading={isLoading && buttonType === "initialize"}>
        Initialize
      </Button>
      <Button action={() => handleWithdraw("close")} isLoading={isLoading && buttonType === "close"}>
        Close
      </Button>
      <Button action={() => handleWithdraw("add_liquidity")} isLoading={isLoading && buttonType === "add_liquidity"}>
        Add liquidity
      </Button>
      <Button
        action={() => handleWithdraw("remove_liquidity")}
        isLoading={isLoading && buttonType === "remove_liquidity"}
      >
        Remove liquidity
      </Button>
      <Button action={() => handleWithdraw("swap")} isLoading={isLoading && buttonType === "swap"}>
        Swap
      </Button>
    </Container>
  );
};

export default memo(WeightPoolView);
