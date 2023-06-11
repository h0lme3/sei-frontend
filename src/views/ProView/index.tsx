import React, { useEffect, useState } from "react";

import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { getSigningCosmWasmClient } from "@sei-js/core";
import { FaPlus } from "react-icons/fa";

import { Button, Col, Row } from "components";
import { useWallet } from "contexts";
import { executeContract, handleErrors, queryContract, rpcUrl } from "utils";

const ProView = () => {
  const { isLoading, setIsLoading, senderAddress, wallet } = useWallet();

  const [count, setCount] = useState<number>(0);
  const [client, setClient] = useState<SigningCosmWasmClient>();

  useEffect(() => {
    fetchCount();
  }, [wallet]);

  const fetchCount = async () => {
    if (wallet) {
      try {
        setIsLoading(true);
        const msg = { get_count: {} };
        const client = await getSigningCosmWasmClient(rpcUrl, wallet.offlineSigner);
        const response = await queryContract(client, msg);
        setClient(client);
        setCount(response.count);
      } catch (error) {
        console.log(error, "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const incrementCounter = async () => {
    if (!client || !senderAddress) return;
    try {
      setIsLoading(true);
      const msg = { increment: {} };
      await executeContract(client, senderAddress, msg);
    } catch (error) {
      handleErrors(error);
    } finally {
      await fetchCount();
    }
  };

  const resetCounter = async () => {
    if (!client || !senderAddress) return;
    try {
      setIsLoading(true);
      const msg = { reset: { count: 0 } };
      // unauthorized error
      await executeContract(client, senderAddress, msg);
    } catch (error) {
      handleErrors(error);
    } finally {
      await fetchCount();
    }
  };

  return (
    <Col className="h-screen justify-center items-center">
      {wallet && (
        <>
          <p className="text-[100px]">{count}</p>
          <Row>
            <Button
              action={incrementCounter}
              isLoading={isLoading}
              className="bg-slate-800 text-white px-4 py-2 rounded-full"
            >
              <FaPlus size={25} />
            </Button>
            <Button
              action={resetCounter}
              isLoading={isLoading}
              className="bg-slate-800 text-white px-4 py-2 rounded-full"
            >
              Reset
            </Button>
          </Row>
        </>
      )}
    </Col>
  );
};

export default ProView;
