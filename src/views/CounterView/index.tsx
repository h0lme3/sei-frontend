import React, { useEffect, useState } from "react";

import { FaPlus } from "react-icons/fa";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { getCosmWasmClient, getSigningCosmWasmClient } from "@sei-js/core";

import { Button, Col, Row } from "components";
import { useMain, useWallet } from "contexts";
import { COUNTER, executeContract, handleErrors, queryContract, rpcUrl } from "utils";

const ProView = () => {
  const { isLoading, setIsLoading, buttonType, setButtonType } = useMain();
  const { senderAddress, wallet } = useWallet();

  const [count, setCount] = useState<number>(0);
  const [client, setClient] = useState<SigningCosmWasmClient>();

  useEffect(() => {
    fetchCount();
  }, [wallet]);

  const fetchCount = async () => {
    try {
      let client;
      const msg = { get_count: {} };
      setIsLoading(true);
      if (!wallet) {
        // without wallet, show number
        client = await getCosmWasmClient(rpcUrl);
      } else {
        // with wallet, show number
        client = await getSigningCosmWasmClient(rpcUrl, wallet.offlineSigner);
        setClient(client);
      }
      const response = await queryContract(client, msg, COUNTER);
      setCount(response.count);
    } catch (error) {
      handleErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  const incrementCounter = async () => {
    if (!client || !senderAddress) return;
    try {
      setButtonType("plus");
      setIsLoading(true);
      const msg = { increment: {} };
      await executeContract(client, senderAddress, msg, COUNTER);
    } catch (error) {
      handleErrors(error);
    } finally {
      await fetchCount();
    }
  };

  const resetCounter = async () => {
    if (!client || !senderAddress) return;
    try {
      setButtonType("reset");
      setIsLoading(true);
      const msg = { reset: { count: 0 } };
      // unauthorized error
      await executeContract(client, senderAddress, msg, COUNTER);
    } catch (error) {
      handleErrors(error);
    } finally {
      await fetchCount();
    }
  };

  return (
    <Col className="h-screen justify-center items-center">
      <Col className="items-center space-y-0">
        <p>Current count number</p>
        <p className="text-[120px]">{count}</p>
      </Col>
      {wallet && (
        <Row>
          <Button
            action={incrementCounter}
            isLoading={isLoading && buttonType === "plus"}
            className="bg-slate-800 text-white px-4 py-2 rounded-full"
          >
            <FaPlus size={25} />
          </Button>
          <Button
            action={resetCounter}
            isLoading={isLoading && buttonType === "reset"}
            className="bg-slate-800 text-white px-4 py-2 rounded-full"
          >
            Reset
          </Button>
        </Row>
      )}
    </Col>
  );
};

export default ProView;
