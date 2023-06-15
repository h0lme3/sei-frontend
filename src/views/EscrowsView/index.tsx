import React, { useEffect, useState } from "react";

import bigInt from "big-integer";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { getCosmWasmClient, getSigningCosmWasmClient } from "@sei-js/core";

import { Button, Col, Container, Page } from "components";
import { useMain, useWallet } from "contexts";
import { ESCROW, executeContract, handleErrors, handleSuccess, queryContract, rpcUrl } from "utils";

const EscrowsView = () => {
  const { isLoading, setIsLoading, buttonType, setButtonType } = useMain();
  const { wallet, senderAddress } = useWallet();

  const [escrows, setEscrows] = useState([]);
  const [client, setClient] = useState<SigningCosmWasmClient>();

  useEffect(() => {
    fetchEscrowList();
    fetchEscrowDetails();
  }, [wallet]);

  const fetchEscrowList = async () => {
    try {
      let client;
      const msg = { list: {} };
      setIsLoading(true);
      if (!wallet) {
        client = await getCosmWasmClient(rpcUrl);
      } else {
        client = await getSigningCosmWasmClient(rpcUrl, wallet.offlineSigner);
        setClient(client);
      }
      const response = await queryContract(client, msg, ESCROW);
      console.log(response.escrows);
      setEscrows(response.escrows);
    } catch (error) {
      handleErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEscrowDetails = async (id = 0) => {
    try {
      let client;
      const msg = { details: { id: id } };
      setIsLoading(true);
      if (!wallet) {
        client = await getCosmWasmClient(rpcUrl);
      } else {
        client = await getSigningCosmWasmClient(rpcUrl, wallet.offlineSigner);
        setClient(client);
      }
      const response = await queryContract(client, msg, ESCROW);
      console.log(response.details);
    } catch (error) {
      handleErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createEscrow = async () => {
    if (!client || !senderAddress) return;
    try {
      setButtonType("create");
      setIsLoading(true);
      const msg = { create: { amount: bigInt("100000000000000000000"), token: null } };
      const response = await executeContract(client, senderAddress, msg, ESCROW);
      handleSuccess(response);
    } catch (error) {
      handleErrors(error);
    } finally {
      await fetchEscrowList();
    }
  };

  const cancelEscrow = async (id: number) => {
    if (!client || !senderAddress) return;
    try {
      setButtonType("cancel");
      setIsLoading(true);
      const msg = { cancel: { id: id } };
      const response = await executeContract(client, senderAddress, msg, ESCROW);
      handleSuccess(response);
    } catch (error) {
      handleErrors(error);
    } finally {
      await fetchEscrowList();
    }
  };

  const approveEscrow = async (id: number) => {
    if (!client || !senderAddress) return;
    try {
      setButtonType("approve");
      setIsLoading(true);
      const msg = { approve: { id: id } };
      const response = await executeContract(client, senderAddress, msg, ESCROW);
      handleSuccess(response);
    } catch (error) {
      handleErrors(error);
    } finally {
      await fetchEscrowList();
    }
  };

  return (
    <Page name="escrow">
      <Container>
        <Col className="h-screen justify-center items-center">
          {wallet && (
            <Button
              action={createEscrow}
              isLoading={isLoading && buttonType === "create"}
              className="bg-slate-800 text-white px-4 py-2 rounded-full"
            >
              Create
            </Button>
          )}
          <Col className="items-center space-y-0">
            <p>Current escrow</p>
            <p className="text-[120px]">
              {escrows.map((escrow, index) => (
                <>
                  <div>{escrow}</div>

                  <Button
                    action={() => cancelEscrow(index)}
                    isLoading={isLoading && buttonType === "cancel"}
                    className="bg-slate-800 text-white px-4 py-2 rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    action={() => approveEscrow(index)}
                    isLoading={isLoading && buttonType === "approve"}
                    className="bg-slate-800 text-white px-4 py-2 rounded-full"
                  >
                    Approve
                  </Button>
                </>
              ))}
            </p>
          </Col>
        </Col>
      </Container>
    </Page>
  );
};

export default EscrowsView;
