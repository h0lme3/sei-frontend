import React, { useEffect, useState } from "react";

import bigInt from "big-integer";
import { BsClipboard, BsClipboardCheck } from "react-icons/bs";
import { coins } from "@cosmjs/amino";

import { Button, Col, Container, Row } from "components";
import { useMain, useWallet } from "contexts";
import { ESCROWS, executeContract, handleErrors, handleSuccess, queryContract, shortenWalletAddress } from "utils";

interface EscrowsDetailsProps {
  id: number;
  owner: string;
  is_cancelled: boolean;
  is_complete: boolean;
  is_coin_escrow: boolean;
  coin_amount: string;
  token_amount: string;
  balance: {
    cw20: Array<number>;
    native: Array<{ demo: string; amount: string }>;
  };
}

const EscrowsView = () => {
  const { isLoading, setIsLoading, buttonType, setButtonType } = useMain();
  const { wallet, senderAddress, client, getClient } = useWallet();

  const [copied, setCopied] = useState(false);
  const [clipboardIndex, setClipboardIndex] = useState<string>("");
  const [escrows, setEscrows] = useState<EscrowsDetailsProps[]>([]);

  useEffect(() => {
    fetchEscrowsList();
  }, [wallet]);

  const getEscrowDetailsByID = async (id: number): Promise<EscrowsDetailsProps> => {
    const client = await getClient();
    const msg = { details: { id } };
    const response = await queryContract(client, msg, ESCROWS);
    return response;
  };

  const fetchEscrowsList = async () => {
    try {
      setIsLoading(true);
      const client = await getClient();
      const msg = { list: {} };
      const { escrows } = await queryContract(client, msg, ESCROWS);
      const escrowIds: number[] = escrows.map((escrow: Pick<EscrowsDetailsProps, "id">) => escrow.id);
      const escrowDetails = await Promise.all(escrowIds.map((escrow, index) => getEscrowDetailsByID(index + 1)));
      setEscrows(escrowDetails);
    } catch (error) {
      handleErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createEscrow = async () => {
    if (!client || !wallet || !senderAddress) return;
    try {
      setButtonType("create");
      setIsLoading(true);
      const funds = coins(100000, "usei"); // 0.1 sei
      const ESCROW_AMOUNT = bigInt("100000000000000");
      const msg = {
        create: {
          amount: ESCROW_AMOUNT,
          token: null,
        },
      };
      const response = await executeContract(client, senderAddress, msg, ESCROWS, funds);
      handleSuccess(response);
    } catch (error) {
      handleErrors(error);
    } finally {
      await fetchEscrowsList();
    }
  };

  const approveOrCancelEscrow = async (id: number, type: string) => {
    if (!client || !senderAddress) return;
    try {
      setButtonType(type);
      setIsLoading(true);
      const msg = type === "approve" ? { approve: { id } } : { cancel: { id } };
      const response = await executeContract(client, senderAddress, msg, ESCROWS);
      handleSuccess(response);
    } catch (error) {
      handleErrors(error);
    } finally {
      await fetchEscrowsList();
    }
  };

  const copyAddress = (address: string, index: number) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setClipboardIndex("clipboard" + index);
    setTimeout(() => setCopied(false), 400);
  };

  return (
    <Container className="py-10">
      <Col className="justify-center items-center">
        {wallet && (
          <Button
            action={createEscrow}
            isLoading={isLoading && buttonType === "create"}
            className="bg-slate-800 text-white px-4 py-2 rounded-full"
          >
            Create
          </Button>
        )}
        <Col className="items-center space-y-2 w-full">
          <p className="text-[36px] mobile:text-[28px] pb-8">Current Escrows</p>
          {escrows &&
            escrows.map((escrow, index) => (
              <Col
                key={`escrow_${index}`}
                className="justify-between max-w-[450px] w-full bg-[#121212] rounded-lg px-6 tablet:px-2 py-8 tablet:py-4"
              >
                <Row className="text-[18px]">
                  <div className="text-[64px]">{escrow.id}</div>
                  <Col className="w-full">
                    <Row className="justify-between">
                      <b>Owner: </b>
                      <Row className="space-x-1">
                        <p> {shortenWalletAddress(escrow.owner, 6)}</p>
                        <sup>
                          {copied && clipboardIndex === `clipboard${escrow.id}` ? (
                            <BsClipboardCheck color="white" size={20} className="cursor-pointer" />
                          ) : (
                            <BsClipboard
                              color="white"
                              size={20}
                              onClick={() => copyAddress(escrow.owner, escrow.id)}
                              className="cursor-pointer"
                            />
                          )}
                        </sup>
                      </Row>
                    </Row>
                    <Row className="justify-between">
                      <b>Coin Amount: </b> <p>{Number(escrow.coin_amount).toLocaleString()}</p>
                    </Row>
                    <Row className="justify-between mobile:flex-col">
                      <b className="self-start">Token Amount: </b>{" "}
                      <p className="self-end">{Number(escrow.token_amount).toLocaleString()}</p>
                    </Row>
                  </Col>
                </Row>
                <Row className="justify-center">
                  <Button
                    action={() => approveOrCancelEscrow(escrow.id, "approve")}
                    disabled={escrow.is_cancelled}
                    isLoading={isLoading && buttonType === "approve"}
                    className="flex-1 bg-slate-800 text-white px-4 py-2 rounded-full"
                  >
                    Approve
                  </Button>
                  <Button
                    action={() => approveOrCancelEscrow(escrow.id, "cancel")}
                    disabled={escrow.is_cancelled}
                    isLoading={isLoading && buttonType === "cancel"}
                    className="flex-1 bg-slate-800 text-white px-4 py-2 rounded-full"
                  >
                    Cancel
                  </Button>
                </Row>
              </Col>
            ))}
        </Col>
      </Col>
    </Container>
  );
};

export default EscrowsView;
