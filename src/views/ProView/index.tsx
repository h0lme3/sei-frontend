import React, { useEffect, useState } from "react";

import { connect, getSigningCosmWasmClient, WalletConnect, WalletWindowKey } from "@sei-js/core";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import { Col, Row } from "components";
import { chainId, executeContract, queryContract, rpcEndpoint } from "utils";

const ProView = () => {
  const [count, setCount] = useState<number>(0);
  const [client, setClient] = useState<SigningCosmWasmClient>();
  const [wallet, setWallet] = useState<WalletConnect>();
  const [senderAddress, setSenderAddress] = useState<string>();

  useEffect(() => {
    fetchCount();
  }, [wallet]);

  const fetchCount = async () => {
    if (wallet) {
      try {
        const msg = { get_count: {} };
        const client = await getSigningCosmWasmClient(rpcEndpoint, wallet.offlineSigner);
        const response = await queryContract(client, msg);
        setClient(client);
        setCount(response.count);
      } catch (error) {
        console.log(error, "error");
      }
    }
  };

  const connectWallet = async (name: WalletWindowKey) => {
    try {
      const wallet = await connect(name, chainId);
      setWallet(wallet);
      setSenderAddress(wallet.accounts[0].address);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const incrementCounter = async () => {
    if (!wallet || !client || !senderAddress) return;
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
    if (!wallet || !client || !senderAddress) return;
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
      <div className="">
        <h1>Count is: {count}</h1>
      </div>
      {!wallet ? (
        <Row>
          <button onClick={() => connectWallet("keplr")} className="bg-slate-800 text-white px-4 py-2 rounded-md">
            Keplr
          </button>
          <button onClick={() => connectWallet("leap")} className="bg-slate-800 text-white px-4 py-2 rounded-md">
            Leap
          </button>
          <button onClick={() => connectWallet("coin98")} className="bg-slate-800 text-white px-4 py-2 rounded-md">
            Coin98
          </button>
          <button onClick={() => connectWallet("falcon")} className="bg-slate-800 text-white px-4 py-2 rounded-md">
            Falcon
          </button>
          <button onClick={() => connectWallet("compass")} className="bg-slate-800 text-white px-4 py-2 rounded-md">
            Compass
          </button>
          <button onClick={() => connectWallet("fin")} className="bg-slate-800 text-white px-4 py-2 rounded-md">
            Fin
          </button>
        </Row>
      ) : (
        <Row>
          <button onClick={incrementCounter} className="bg-slate-800 text-white px-4 py-2 rounded-md">
            +
          </button>
          <button onClick={resetCounter} className="bg-slate-800 text-white px-4 py-2 rounded-md">
            Reset
          </button>
        </Row>
      )}
    </Col>
  );
};

export default ProView;
