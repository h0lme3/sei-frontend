import React, { useEffect, useState } from "react";

import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { getSigningCosmWasmClient } from "@sei-js/core";

import { Button, Col, Row } from "components";
import { useWallet } from "contexts";
import { executeContract, queryContract, rpcUrl } from "utils";

const ProView = () => {
  const { senderAddress, wallet } = useWallet();

  const [count, setCount] = useState<number>(0);
  const [client, setClient] = useState<SigningCosmWasmClient>();

  useEffect(() => {
    fetchCount();
  }, [wallet]);

  const fetchCount = async () => {
    if (wallet) {
      try {
        const msg = { get_count: {} };
        const client = await getSigningCosmWasmClient(rpcUrl, wallet.offlineSigner);
        const response = await queryContract(client, msg);
        setClient(client);
        setCount(response.count);
      } catch (error) {
        console.log(error, "error");
      }
    }
  };

  const incrementCounter = async () => {
    if (!client || !senderAddress) return;
    try {
      const msg = { increment: {} };
      await executeContract(client, senderAddress, msg);
    } catch (e) {
      console.error(e);
    } finally {
      await fetchCount();
    }
  };

  const resetCounter = async () => {
    if (!client || !senderAddress) return;
    try {
      const msg = { reset: { count: 0 } };
      // unauthorized error
      await executeContract(client, senderAddress, msg);
    } catch (e) {
      console.error(e);
    } finally {
      await fetchCount();
    }
  };

  return (
    <Col className="h-screen justify-center items-center">
      <h1>Count is: {count}</h1>
      {wallet && (
        <Row>
          <Button action={incrementCounter} className="bg-slate-800 text-white px-4 py-2 rounded-md">
            +
          </Button>
          <Button action={resetCounter} className="bg-slate-800 text-white px-4 py-2 rounded-md">
            Reset
          </Button>
        </Row>
      )}
    </Col>
  );
};

export default ProView;
