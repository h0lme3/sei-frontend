import React, { memo, useEffect } from "react";

import bigInt from "big-integer";

import { Button, Col, Container } from "components";
import { useMain, useWallet } from "contexts";
import { useCosmWasmClient, useSigningCosmWasmClient } from "hooks";
import { VAULT_ADDRESS, TOKEN_ADDRESS, executeContract, handleErrors, handleSuccess, queryContract } from "utils";
// import type { VaultDetailsProps } from "types";

const VaultView = () => {
  const { isLoading, setIsLoading, buttonType, setButtonType } = useMain();
  const { senderAddress } = useWallet();
  const { cosmWasmClient } = useCosmWasmClient();
  const { signingCosmWasmClient } = useSigningCosmWasmClient();

  // const [vaultDetails, setVaultDetails] = useState<VaultDetailsProps>();

  useEffect(() => {
    fetchDetails();
  }, [cosmWasmClient]);

  const fetchDetails = async () => {
    if (!cosmWasmClient) return;
    try {
      setIsLoading(true);
      const msg = { details: {} };
      const response = await queryContract(cosmWasmClient, msg, VAULT_ADDRESS);
      console.log(response, "response");
      // setVaultDetails(response);
    } catch (error) {
      handleErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  // console.log(vaultDetails, "details");

  const handleWithdraw = async (type: string) => {
    if (!signingCosmWasmClient || !senderAddress) return;
    try {
      setButtonType(type);
      setIsLoading(true);
      let msg;
      if (type === "withdraw") {
        msg = {
          withdraw: {
            receiver: { senderAddress },
            token: {
              token_address: TOKEN_ADDRESS,
              amount: bigInt("1000000"),
            },
          },
        };
      }
      if (type === "update_emergency") {
        msg = {
          update_emergency: [0, 9],
        };
      }
      if (type === "update_beneficiary") {
        msg = { update_beneficiary: { beneficiary: "address" } };
      }
      if (type === "update_admin") {
        msg = { update_admin: { admin: "address" } };
      }
      if (type === "update_delegator") {
        msg = { update_delegator: { delegator: "address" } };
      }
      if (type === "update_arbitrageur") {
        msg = { update_arbitrageur: { arbitrageur: "address" } };
      }
      const response = await executeContract(signingCosmWasmClient, senderAddress, msg, VAULT_ADDRESS);
      handleSuccess(response);
    } catch (error) {
      handleErrors(error);
    } finally {
      await fetchDetails();
    }
  };

  return (
    <Container className="py-10">
      <Col>
        <Button action={() => handleWithdraw("withdraw")} isLoading={isLoading && buttonType === "withdraw"}>
          Withdraw
        </Button>
        <Button
          action={() => handleWithdraw("update_emergency")}
          isLoading={isLoading && buttonType === "update_emergency"}
        >
          Update Emergency
        </Button>
        <Button
          action={() => handleWithdraw("update_beneficiary")}
          isLoading={isLoading && buttonType === "update_beneficiary"}
        >
          Update Beneficiary
        </Button>

        <Button action={() => handleWithdraw("update_admin")} isLoading={isLoading && buttonType === "update_admin"}>
          Update Admin
        </Button>
        <Button
          action={() => handleWithdraw("update_delegator")}
          isLoading={isLoading && buttonType === "update_delegator"}
        >
          Update Delegator
        </Button>
        <Button
          action={() => handleWithdraw("update_arbitrageur")}
          isLoading={isLoading && buttonType === "update_arbitrageur"}
        >
          Update Arbitrageur
        </Button>
      </Col>
    </Container>
  );
};

export default memo(VaultView);
