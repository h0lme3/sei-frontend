import React, { type FC } from "react";
import Image from "next/image";

import { Col, Row, Modal } from "components";
import { wallets } from "utils";

interface WalletConnectModalProps {
  connectWallet: (walletTypeId: number) => void;
}

const WalletConnectModal: FC<WalletConnectModalProps> = ({ connectWallet }) => {
  return (
    <Modal>
      <Col className="pb-4 space-y-4">
        <p className="px-14 pb-12 text-[24px] mobile:text-[20px] text-center font-medium">
          Connect a wallet on SEI to continue
        </p>
        {wallets.map((wallet, index) => (
          <Row
            key={`wallet_${index}`}
            action={() => connectWallet(index + 1)}
            className="px-6 py-2 text-[16px] cursor-pointer transition ease-in-out hover:bg-modal_object_hover"
          >
            <Image src={wallet.src} alt={wallet.name} width={32} height={32} priority />
            <p className="capitalize text-[18px]">{wallet.name}</p>
          </Row>
        ))}
      </Col>
    </Modal>
  );
};

export default WalletConnectModal;
