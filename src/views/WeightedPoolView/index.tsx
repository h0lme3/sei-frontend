import React, { memo, useEffect, useState } from "react";

// import bigInt from "big-integer";
import type { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import { Button, Col, Container } from "components";
import { useMain, useWallet } from "contexts";
import { useCosmWasmClient, useSigningCosmWasmClient } from "hooks";
import {
  TOKEN_A,
  // TOKEN_ADDRESS,
  TOKEN_B,
  TOKEN_STATIC_AMOUNT,
  VAULT_ADDRESS,
  WEIGHTED_POOL_ADDRESS,
  executeContract,
  // executeMultipleContract,
  handleErrors,
  handleSuccess,
  queryContract,
} from "utils";
import type { PoolsDetailsProps } from "types";

const WeightedPoolView = () => {
  const { isLoading, setIsLoading, buttonType, setButtonType } = useMain();
  const { wallet, senderAddress, openModal } = useWallet();
  const { cosmWasmClient } = useCosmWasmClient();
  const { signingCosmWasmClient } = useSigningCosmWasmClient();

  const [poolsDetails, setPoolsDetails] = useState<PoolsDetailsProps[]>([]);

  useEffect(() => {
    fetchWeightedPoolList();
  }, [cosmWasmClient]);

  const getWeightedPoolDetailsByID = async (cosmWasmClient: CosmWasmClient, id: string): Promise<PoolsDetailsProps> => {
    const msg = { details: { id } };
    const response = await queryContract(cosmWasmClient, msg, WEIGHTED_POOL_ADDRESS);
    return response;
  };

  console.log(poolsDetails, "poolsDetails");

  const fetchWeightedPoolList = async () => {
    if (!cosmWasmClient) return;
    try {
      setIsLoading(true);
      const msg = { list: {} };
      const { pools } = await queryContract(cosmWasmClient, msg, WEIGHTED_POOL_ADDRESS);
      const poolsIds: string[] = pools.map((pool: string) => pool);
      const poolsDetails = await Promise.all(poolsIds.map((pool) => getWeightedPoolDetailsByID(cosmWasmClient, pool)));

      setPoolsDetails(poolsDetails);
    } catch (error) {
      handleErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSwap = async (type: string) => {};

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
        const allowanceMsg = {
          increase_allowance: {
            spender: WEIGHTED_POOL_ADDRESS,
            amount: TOKEN_STATIC_AMOUNT,
            expires: null,
          },
        };

        await executeContract(signingCosmWasmClient, senderAddress, allowanceMsg, TOKEN_A);

        msg = {
          swap: {
            min_amount: "0",
            pool_id: "4",
            token_a: {
              token_address: TOKEN_A,
              amount: TOKEN_STATIC_AMOUNT,
            },
            token_b: TOKEN_B,
            vault: VAULT_ADDRESS,
          },
        };

        // const msg: ExecuteInstruction[] = [
        //   { contractAddress: TOKEN_A, msg: allowanceMsg },
        //   { contractAddress: WEIGHTED_POOL_ADDRESS, msg: swapMsg },
        // ];

        // const response = await executeMultipleContract(signingCosmWasmClient, senderAddress, msg);
        // handleSuccess(response);
      }

      const response = await executeContract(signingCosmWasmClient, senderAddress, msg, WEIGHTED_POOL_ADDRESS);
      handleSuccess(response);
    } catch (error) {
      handleErrors(error);
    } finally {
      await fetchWeightedPoolList();
    }
  };

  return (
    <Container>
      {/* {modalType === "initialize_pool" && <CreateEscrowModal fetchEscrowsList={fetchEscrowsList} />} */}
      <Col className="justify-center items-center">
        {wallet && (
          <Button action={() => openModal("initialize_pool")}>Initialize</Button>
          //   <Button action={() => handleWithdraw("initialize")} isLoading={isLoading && buttonType === "initialize"}>
          //   Initialize
          // </Button>
        )}
        <Col className="items-center space-y-2 w-full">
          <p className="text-[36px] mobile:text-[28px] pb-8">Current Pool List</p>
          <Button action={() => handleWithdraw("close")} isLoading={isLoading && buttonType === "close"}>
            Close
          </Button>
          <Button
            action={() => handleWithdraw("add_liquidity")}
            isLoading={isLoading && buttonType === "add_liquidity"}
          >
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
        </Col>
      </Col>
    </Container>
  );
};

export default memo(WeightedPoolView);
