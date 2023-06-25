import React, { useEffect, useState, memo } from "react";

import { FaPlus } from "react-icons/fa";

import { Button, Col, Container, Row } from "components";
import { useMain, useWallet } from "contexts";
import { useCosmWasmClient, useSigningCosmWasmClient } from "hooks";
import { COUNTER_ADDRESS, executeContract, handleErrors, handleSuccess, queryContract } from "utils";

const CounterView = () => {
  const { isLoading, setIsLoading, buttonType, setButtonType } = useMain();
  const { senderAddress, wallet } = useWallet();
  const { cosmWasmClient } = useCosmWasmClient();
  const { signingCosmWasmClient } = useSigningCosmWasmClient();

  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    fetchCount();
  }, [cosmWasmClient]);

  const fetchCount = async () => {
    if (!cosmWasmClient) return;
    try {
      setIsLoading(true);
      const msg = { get_count: {} };
      const { count } = await queryContract(cosmWasmClient, msg, COUNTER_ADDRESS);
      setCount(count);
    } catch (error) {
      handleErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrementOrResetCounter = async (type: string) => {
    if (!signingCosmWasmClient || !senderAddress) return;
    try {
      setButtonType(type);
      setIsLoading(true);
      const incrementMsg = { increment: {} };
      const resetMsg = { reset: { count: 0 } };
      const msg = type === "plus_count" ? incrementMsg : resetMsg;
      const response = await executeContract(signingCosmWasmClient, senderAddress, msg, COUNTER_ADDRESS);
      handleSuccess(response);
    } catch (error) {
      handleErrors(error);
    } finally {
      await fetchCount();
    }
  };

  return (
    <Container className="py-10">
      <Col className="justify-center items-center">
        <Col className="items-center space-y-0">
          <p>Current count number</p>
          <p className="text-[120px]">{count}</p>
        </Col>
        {wallet && (
          <Row>
            <Button
              action={() => handleIncrementOrResetCounter("plus_count")}
              isLoading={isLoading && buttonType === "plus_count"}
            >
              <FaPlus size={25} />
            </Button>
            <Button
              action={() => handleIncrementOrResetCounter("reset_count")}
              isLoading={isLoading && buttonType === "reset_count"}
            >
              Reset
            </Button>
          </Row>
        )}
      </Col>
    </Container>
  );
};

export default memo(CounterView);
