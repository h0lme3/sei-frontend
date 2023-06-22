import React, { useEffect, useState, memo } from "react";

import { FaPlus } from "react-icons/fa";

import { Button, Col, Container, Row } from "components";
import { useMain, useWallet } from "contexts";
import { COUNTER, executeContract, handleErrors, queryContract } from "utils";

const CounterView = () => {
  const { isLoading, setIsLoading, buttonType, setButtonType } = useMain();
  const { senderAddress, wallet, client, getClient } = useWallet();

  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    fetchCount();
  }, [wallet]);

  const fetchCount = async () => {
    try {
      setIsLoading(true);
      const client = await getClient();
      const msg = { get_count: {} };
      const { count } = await queryContract(client, msg, COUNTER);
      setCount(count);
    } catch (error) {
      handleErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  const incrementOrResetCounter = async (type: string) => {
    if (!client || !senderAddress) return;
    try {
      setButtonType(type);
      setIsLoading(true);
      const incrementMsg = { increment: {} };
      const resetMsg = { reset: { count: 0 } };
      const msg = type === "plus" ? incrementMsg : resetMsg;
      await executeContract(client, senderAddress, msg, COUNTER);
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
            <Button action={() => incrementOrResetCounter("plus")} isLoading={isLoading && buttonType === "plus"}>
              <FaPlus size={25} />
            </Button>
            <Button action={() => incrementOrResetCounter("reset")} isLoading={isLoading && buttonType === "reset"}>
              Reset
            </Button>
          </Row>
        )}
      </Col>
    </Container>
  );
};

export default memo(CounterView);
