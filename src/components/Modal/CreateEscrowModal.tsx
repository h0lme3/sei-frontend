import type { ChangeEvent, KeyboardEvent } from "react";
import React, { useState } from "react";

import bigInt from "big-integer";
import { BsCheckCircleFill } from "react-icons/bs";
import { coins } from "@cosmjs/amino";

import { Button, Col, Modal, Row } from "components";
import { useMain, useWallet } from "contexts";
import { useCosmWasmClient, useSigningCosmWasmClient } from "hooks";
import {
  ESCROWS_ADDRESS,
  ESCROW_RADIO,
  FLOAT_NUM_REGEX,
  TOKEN_ADDRESS,
  USEI_DECIMALS,
  executeContract,
  handleErrors,
  handleSuccess,
  queryContract,
} from "utils";
import type { TokenDetailProps } from "types";

const CreateEscrowModal = ({ fetchEscrowsList = () => {} }) => {
  const { wallet, senderAddress, closeWalletModal } = useWallet();
  const { isLoading, setIsLoading, buttonType, setButtonType } = useMain();
  const { cosmWasmClient } = useCosmWasmClient();
  const { signingCosmWasmClient } = useSigningCosmWasmClient();

  const [warning, setWarning] = useState(false);
  const [escrowTokenForm, setEscrowTokenForm] = useState<{
    escrowType: string;
    seiAmount: number | null;
    tokenAmount: number | null;
    tokenDetail?: TokenDetailProps;
    tokenAddress?: string;
  }>({ escrowType: ESCROW_RADIO[0], seiAmount: null, tokenAmount: null });

  const handleEscrowTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEscrowTokenForm({ ...escrowTokenForm, escrowType: event.target.value });
  };

  const handleTokenAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    const validValue = value !== "" && !isNaN(Number(value)) ? Number(value) : null;

    setEscrowTokenForm({
      ...escrowTokenForm,
      [name]: validValue,
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
    if (
      !signingCosmWasmClient ||
      !wallet ||
      !senderAddress ||
      !escrowTokenForm.tokenAmount ||
      !escrowTokenForm.seiAmount ||
      !escrowTokenForm.tokenDetail
    )
      return;
    setButtonType("create_escrow");
    setIsLoading(true);
    const token_amount = bigInt(escrowTokenForm.tokenAmount * 10 ** escrowTokenForm.tokenDetail.decimals);
    const sei_amount = bigInt(escrowTokenForm.seiAmount * 10 ** USEI_DECIMALS);
    try {
      let response;
      if (escrowTokenForm.escrowType === ESCROW_RADIO[0]) {
        // sei-token
        const funds = coins(sei_amount.toJSNumber(), "usei"); // 100,000 usei - 0.1 sei
        const msg = {
          create: {
            amount: sei_amount,
            token: {
              amount: token_amount,
              token_address: TOKEN_ADDRESS,
            },
          },
        };
        response = await executeContract(signingCosmWasmClient, senderAddress, msg, ESCROWS_ADDRESS, funds);
      } else {
        // token-sei
        const allowanceMsg = {
          increase_allowance: {
            spender: ESCROWS_ADDRESS,
            amount: token_amount,
            expires: null,
          },
        };
        await executeContract(signingCosmWasmClient, senderAddress, allowanceMsg, TOKEN_ADDRESS);

        const msg = {
          create: {
            amount: sei_amount,
            token: {
              amount: token_amount,
              token_address: TOKEN_ADDRESS,
            },
          },
        };
        response = await executeContract(signingCosmWasmClient, senderAddress, msg, ESCROWS_ADDRESS);
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
        setEscrowTokenForm({ escrowType: ESCROW_RADIO[0], seiAmount: null, tokenAmount: null });
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
        <p className="px-14 mobile:px-8 pb-12 text-[24px] mobile:text-[20px] text-center font-medium">
          You can escrow your {escrowTokenForm.escrowType === ESCROW_RADIO[0] ? "SEI" : "Token"} to get{" "}
          {escrowTokenForm.escrowType === ESCROW_RADIO[0] ? "Token" : "SEI"}
        </p>
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
              value={escrowTokenForm.tokenAddress ?? ""}
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
                <span className="label-text">Enter SEI amount</span>
              </label>
              <label className="input-group">
                <span>SEI</span>
                <input
                  type="number"
                  name="seiAmount"
                  pattern={FLOAT_NUM_REGEX}
                  value={escrowTokenForm.seiAmount ?? ""}
                  placeholder="i.e. 4"
                  min={0}
                  step="any"
                  onChange={handleTokenAmountChange}
                  className="input input-bordered w-full"
                />
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Enter {escrowTokenForm.tokenDetail.symbol} amount</span>
              </label>
              <label className="input-group">
                <span>{escrowTokenForm.tokenDetail.symbol}</span>
                <input
                  type="number"
                  name="tokenAmount"
                  pattern={FLOAT_NUM_REGEX}
                  value={escrowTokenForm.tokenAmount ?? ""}
                  placeholder="i.e. 400"
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
          disabled={!escrowTokenForm.tokenAmount || !escrowTokenForm.tokenAddress || !escrowTokenForm.seiAmount}
          isLoading={isLoading && buttonType === "create_escrow"}
        >
          Submit
        </Button>
      </Col>
    </Modal>
  );
};

export default CreateEscrowModal;
