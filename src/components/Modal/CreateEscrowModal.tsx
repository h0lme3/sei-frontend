import type { ChangeEvent, KeyboardEvent } from "react";
import React, { useState } from "react";

import { BsCheckCircleFill } from "react-icons/bs";
import { coins } from "@cosmjs/amino";

import { Button, Col, Modal, Row } from "components";
import { useMain, useWallet } from "contexts";
import { useCosmWasmClient, useSigningCosmWasmClient } from "hooks";
import {
  ESCROWS,
  ESCROW_RADIO,
  FLOAT_NUM_REGEX,
  executeContract,
  handleErrors,
  handleSuccess,
  queryContract,
  tokenAddress,
} from "utils";
import type { TokenDetailProps } from "types";
import bigInt from "big-integer";

const CreateEscrowModal = ({ fetchEscrowsList = () => {} }) => {
  const { wallet, senderAddress, closeWalletModal } = useWallet();
  const { isLoading, setIsLoading, buttonType, setButtonType } = useMain();
  const { cosmWasmClient } = useCosmWasmClient();
  const { signingCosmWasmClient } = useSigningCosmWasmClient();

  const [warning, setWarning] = useState(false);
  const [escrowTokenForm, setEscrowTokenForm] = useState<{
    escrowType: string;
    tokenAmount: number | null;
    tokenDetail?: TokenDetailProps;
    tokenAddress?: string;
  }>({ escrowType: ESCROW_RADIO[0], tokenAmount: null });

  const handleEscrowTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEscrowTokenForm({ ...escrowTokenForm, escrowType: event.target.value });
  };

  const handleTokenAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const validValue = value !== "" && !isNaN(Number(value)) ? Number(value) : null;

    setEscrowTokenForm({
      ...escrowTokenForm,
      tokenAmount: validValue,
    });
  };

  const handleTokenAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWarning(false);
    setEscrowTokenForm({
      ...escrowTokenForm,
      tokenAddress: event.target.value,
    });
  };

  const handleEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    event.key === "Enter" && fetchTokenMetadata();
  };

  const handleCreateEscrow = async () => {
    if (!signingCosmWasmClient || !wallet || !senderAddress || !escrowTokenForm.tokenAmount) return;
    setButtonType("create_escrow");
    setIsLoading(true);
    const token_amount = bigInt(escrowTokenForm.tokenAmount);
    try {
      let response;
      if (escrowTokenForm.escrowType === ESCROW_RADIO[0]) {
        // sei-token
        const funds = coins(100000, "usei"); // 0.1 sei
        const msg = {
          create: {
            amount: token_amount,
            token: {
              amount: token_amount,
              token_address: tokenAddress,
            },
          },
        };
        response = await executeContract(signingCosmWasmClient, senderAddress, msg, ESCROWS, funds);
      } else {
        // token-sei
        // todo: not sure how can I pass correct msg(i.e. token amount, token address, usei amount, usei address) even tho I can get all values.
        const msg = {
          create: {
            amount: token_amount,
            token: {
              amount: token_amount,
              token_address: tokenAddress,
            },
          },
        };
        response = await executeContract(signingCosmWasmClient, senderAddress, msg, ESCROWS);
      }
      handleSuccess(response);
    } catch (error) {
      handleErrors(error);
    } finally {
      closeWalletModal();
      await fetchEscrowsList();
    }
  };

  const fetchTokenMetadata = async () => {
    if (!cosmWasmClient) return;
    if (escrowTokenForm.tokenAddress) {
      setIsLoading(true);
      try {
        const msg = { token_info: {} };
        const result = await queryContract(cosmWasmClient, msg, escrowTokenForm.tokenAddress);
        setEscrowTokenForm({ ...escrowTokenForm, tokenDetail: result });
      } catch (error) {
        setEscrowTokenForm({ escrowType: ESCROW_RADIO[0], tokenAmount: null });
        handleErrors(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setWarning(true);
    }
  };

  return (
    <Modal>
      <Col className="p-4 space-y-4">
        <p className="px-14 pb-12 text-[24px] mobile:text-[20px] text-center font-medium">Create escrow now!</p>
        <Row>
          {ESCROW_RADIO.map((name) => (
            <Row key={name}>
              <input
                type="radio"
                checked={escrowTokenForm.escrowType === name}
                value={name}
                onChange={handleEscrowTypeChange}
                className="radio checked:bg-white"
              />
              <label className="label">
                <span className="label-text uppercase">{name}</span>
              </label>
            </Row>
          ))}
        </Row>
        <div className="form-control">
          <label className="input-group">
            <input
              type="text"
              placeholder={
                warning
                  ? "Enter the token address"
                  : "i.e. sei1qvdgeuyhc8vq0w4uh9p8g3wrf5m8md3farjumtx55x8n88mfc8gs749h58"
              }
              onChange={handleTokenAddressChange}
              onKeyDown={handleEnterKeyDown}
              className={`input input-bordered w-full ${warning ? "outline outline-red-600" : "outline-none"}`}
            />
            <span onClick={fetchTokenMetadata} className="cursor-pointer">
              <BsCheckCircleFill size="25" />
            </span>
          </label>
        </div>
        {escrowTokenForm.tokenDetail && (
          <>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Enter amount</span>
              </label>
              <label className="input-group">
                <span>{escrowTokenForm.tokenDetail.symbol}</span>
                <input
                  type="number"
                  pattern={FLOAT_NUM_REGEX}
                  value={escrowTokenForm.tokenAmount ?? ""}
                  placeholder="i.e. 100"
                  min={0}
                  step="any"
                  onChange={handleTokenAmountChange}
                  className="input input-bordered w-full"
                />
              </label>
            </div>
            <label className="input-group">
              <input
                type="text"
                readOnly
                value={escrowTokenForm.tokenDetail.decimals}
                placeholder="i.e. 18"
                className="input input-bordered w-full cursor-default"
              />
              <span>Decimals</span>
            </label>
          </>
        )}
        <Button
          action={handleCreateEscrow}
          disabled={!escrowTokenForm.tokenAmount || !escrowTokenForm.tokenAddress}
          isLoading={isLoading && buttonType === "create_escrow"}
        >
          Submit
        </Button>
      </Col>
    </Modal>
  );
};

export default CreateEscrowModal;
