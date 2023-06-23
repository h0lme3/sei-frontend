import React, { useCallback, useEffect, useState, memo } from "react";

import { AiOutlineCheck } from "react-icons/ai";
import { BsClipboard } from "react-icons/bs";
import { coins } from "@cosmjs/amino";
import { toBinary } from "@cosmjs/cosmwasm-stargate";

import { Button, Col, Container, Row } from "components";
import { useMain, useWallet } from "contexts";
import {
  ESCROWS,
  ESCROW_AMOUNT,
  executeContract,
  handleErrors,
  handleSuccess,
  queryContract,
  shortenWalletAddress,
  Native_Token_Decimals,
  TOKEN,
} from "utils";

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

interface TokenDetailProps {
  name: string;
  symbol: string;
  decimals: number;
  total_supply: number;
}

const EscrowsView = () => {
  const { isLoading, setIsLoading, buttonType, setButtonType } = useMain();
  const { wallet, senderAddress, client, getClient } = useWallet();

  const [copied, setCopied] = useState(false);
  const [clipboardIndex, setClipboardIndex] = useState<string>("");
  const [escrows, setEscrows] = useState<EscrowsDetailsProps[]>([]);
  const [tokenDetail, setTokenDetail] = useState<TokenDetailProps>();

  useEffect(() => {
    fetchTokenMetadata();
  }, []);

  useEffect(() => {
    fetchEscrowsList();
  }, [wallet]);

  const getEscrowDetailsByID = useCallback(
    async (id: number): Promise<EscrowsDetailsProps> => {
      const client = await getClient();
      const msg = { details: { id } };
      const response = await queryContract(client, msg, ESCROWS);
      return response;
    },
    [getClient]
  );

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

  const fetchTokenMetadata = async () => {
    try {
      setIsLoading(true);
      const client = await getClient();
      const msg = { token_info: {} };
      await queryContract(client, msg, TOKEN).then(setTokenDetail);
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
    const amount = escrows[id - 1].token_amount;
    try {
      setButtonType(type);
      setIsLoading(true);
      const approveMsg = {
        approve: {
          id,
          token: {
            sender: senderAddress,
            amount,
            msg: toBinary({}),
          },
        },
      };
      const cancelMsg = { cancel: { id } };
      const msg = type === "approve" ? approveMsg : cancelMsg;
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
                            <AiOutlineCheck color="green" size={15} className="cursor-pointer" />
                          ) : (
                            <BsClipboard
                              color="white"
                              size={15}
                              onClick={() => copyAddress(escrow.owner, escrow.id)}
                              className="cursor-pointer"
                            />
                          )}
                        </sup>
                      </Row>
                    </Row>
                    <Row className="justify-between">
                      <b>Coin Amount (USEI): </b>{" "}
                      <p>{(Number(escrow.coin_amount) / 10 ** Native_Token_Decimals).toLocaleString()}</p>
                    </Row>
                    {tokenDetail && (
                      <Row className="justify-between mobile:flex-col">
                        <b className="self-start">
                          Token Amount <span> ({tokenDetail.symbol})</span>:{" "}
                        </b>{" "}
                        <p className="self-end">
                          {(Number(escrow.token_amount) / 10 ** tokenDetail.decimals).toLocaleString("en", {
                            minimumFractionDigits: 5,
                          })}
                        </p>
                      </Row>
                    )}
                  </Col>
                </Row>
                <Row className="justify-center">
                  <Button
                    action={() => approveOrCancelEscrow(escrow.id, "approve")}
                    disabled={escrow.is_cancelled || escrow.is_complete}
                    isLoading={isLoading && buttonType === "approve"}
                    className="flex-1 bg-slate-800 text-white px-4 py-2 rounded-full"
                  >
                    Approve
                  </Button>
                  <Button
                    action={() => approveOrCancelEscrow(escrow.id, "cancel")}
                    disabled={escrow.is_cancelled || escrow.is_complete}
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

export default memo(EscrowsView);
