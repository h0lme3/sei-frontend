import React, { useEffect, useState, memo } from "react";

import bigInt from "big-integer";
import { AiOutlineCheck } from "react-icons/ai";
import { BsClipboard } from "react-icons/bs";
import type { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import { Button, Col, Container, CreateEscrowModal, Row } from "components";
import { useMain, useWallet } from "contexts";
import { useCosmWasmClient, useSigningCosmWasmClient } from "hooks";
import {
  ESCROWS,
  executeContract,
  handleErrors,
  handleSuccess,
  queryContract,
  shortenWalletAddress,
  Native_Token_Decimals,
  TOKEN,
  tokenAddress,
} from "utils";
import type { EscrowsDetailsProps, TokenDetailProps } from "types";

const EscrowsView = () => {
  const { isLoading, setIsLoading, buttonType, setButtonType, modalType } = useMain();
  const { wallet, senderAddress, openWalletModal } = useWallet();
  const { cosmWasmClient } = useCosmWasmClient();
  const { signingCosmWasmClient } = useSigningCosmWasmClient();

  const [copied, setCopied] = useState(false);
  const [clipboardIndex, setClipboardIndex] = useState<string>("");
  const [escrowsDetails, setEscrowsDetails] = useState<EscrowsDetailsProps[]>([]);
  const [tokenDetail, setTokenDetail] = useState<TokenDetailProps>();

  useEffect(() => {
    fetchTokenMetadata();
    fetchEscrowsList();
  }, [cosmWasmClient]);

  const getEscrowDetailsByID = async (cosmWasmClient: CosmWasmClient, id: number): Promise<EscrowsDetailsProps> => {
    const msg = { details: { id } };
    const response = await queryContract(cosmWasmClient, msg, ESCROWS);
    return response;
  };

  const fetchEscrowsList = async () => {
    if (!cosmWasmClient) return;
    try {
      setIsLoading(true);
      const msg = { list: {} };
      const { escrows } = await queryContract(cosmWasmClient, msg, ESCROWS);
      const escrowsIds: number[] = escrows.map((escrow: Pick<EscrowsDetailsProps, "id">) => escrow.id);
      const escrowsDetails = await Promise.all(
        escrowsIds.map((escrow, index) => getEscrowDetailsByID(cosmWasmClient, index + 1))
      );
      setEscrowsDetails(escrowsDetails);
    } catch (error) {
      handleErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTokenMetadata = async () => {
    if (!cosmWasmClient) return;
    try {
      setIsLoading(true);
      const msg = { token_info: {} };
      await queryContract(cosmWasmClient, msg, TOKEN).then(setTokenDetail);
    } catch (error) {
      handleErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveOrCancelEscrow = async (id: number, type: string) => {
    if (!signingCosmWasmClient || !senderAddress) return;
    const amount = bigInt(escrowsDetails[id - 1].token_amount);
    // const amount = escrowsDetails[id - 1].token_amount;
    try {
      setButtonType(type);
      setIsLoading(true);
      const approveMsg = {
        approve: {
          id,
          token: {
            token_address: tokenAddress,
            amount,
          },
        },
      };
      const cancelMsg = { cancel: { id } };
      const msg = type === "approve" ? approveMsg : cancelMsg;
      const response = await executeContract(signingCosmWasmClient, senderAddress, msg, ESCROWS);
      handleSuccess(response);
    } catch (error) {
      handleErrors(error);
    } finally {
      await fetchEscrowsList();
    }
  };

  const handleCopyAddress = (address: string, index: number) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setClipboardIndex("clipboard" + index);
    setTimeout(() => setCopied(false), 400);
  };

  return (
    <>
      {modalType === "create_escrow" && <CreateEscrowModal fetchEscrowsList={fetchEscrowsList} />}
      <Container className="py-10">
        <Col className="justify-center items-center">
          {wallet && (
            <Button
              action={() => openWalletModal("create_escrow")}
              className="bg-slate-800 text-white px-4 py-2 rounded-full"
            >
              Create
            </Button>
          )}
          <Col className="items-center space-y-2 w-full">
            <p className="text-[36px] mobile:text-[28px] pb-8">Current Escrows</p>
            {escrowsDetails &&
              escrowsDetails.map((escrow, index) => (
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
                              <AiOutlineCheck color="lightgreen" size={15} className="cursor-pointer" />
                            ) : (
                              <BsClipboard
                                color="white"
                                size={15}
                                onClick={() => handleCopyAddress(escrow.owner, escrow.id)}
                                className="cursor-pointer"
                              />
                            )}
                          </sup>
                        </Row>
                      </Row>
                      <Row className="justify-between">
                        <b>Coin Amount (SEI): </b>{" "}
                        <p>{(escrow.coin_amount / 10 ** Native_Token_Decimals).toLocaleString()}</p>
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
                  {wallet && (
                    <Row className="justify-center">
                      <Button
                        action={() => handleApproveOrCancelEscrow(escrow.id, "approve_escrow")}
                        disabled={escrow.is_cancelled || escrow.is_complete}
                        isLoading={isLoading && buttonType === "approve_escrow"}
                        className="flex-1 bg-slate-800 text-white px-4 py-2 rounded-full"
                      >
                        Approve
                      </Button>
                      <Button
                        action={() => handleApproveOrCancelEscrow(escrow.id, "cancel_escrow")}
                        disabled={escrow.is_cancelled || escrow.is_complete}
                        isLoading={isLoading && buttonType === "cancel_escrow"}
                        className="flex-1 bg-slate-800 text-white px-4 py-2 rounded-full"
                      >
                        Cancel
                      </Button>
                    </Row>
                  )}
                </Col>
              ))}
          </Col>
        </Col>
      </Container>
    </>
  );
};

export default memo(EscrowsView);
