import React, { type FC } from "react";
import Image from "next/image";

import { FaTimes } from "react-icons/fa";
import { Transition } from "react-transition-group";
import tw from "tailwind-styled-components";

import { Col, Row } from "components";
import { useWallet } from "contexts";
import { wallets } from "utils";
import type { WalletInfoProps } from "types";

interface ModalProps {
  $state: string;
}

interface WalletConnectModalProps {
  connectWallet: (name: WalletInfoProps) => void;
}

const Modal = tw.div<ModalProps>`
    // state === exiting || exited => opacity-0
    ${(props) => (props.$state === "entering" || props.$state === "entered" ? "opacity-100" : "opacity-0")}
`;

const WalletConnectModal: FC<WalletConnectModalProps> = ({ connectWallet }) => {
  const { isWalletModalOpen, closeWalletModal } = useWallet();

  const duration = 100;

  return (
    <Transition in={isWalletModalOpen} timeout={duration} unmountOnExit>
      {(state) => (
        <Modal
          $state={state}
          className="transition-opacity duration-100 ease-in-out fixed z-20 top-0 w-full h-full flex items-center bg-[#00000068]"
        >
          <div className="absolute w-full h-full z-[1]" onClick={closeWalletModal} />
          <Col className="relative z-[2] mx-auto overflow-auto w-[400px] medium:w-full max-w-full max-h-[80%] my-10 pt-0 font-dm_sans text-white rounded-2xl bg-[#10141f]">
            <Row
              action={closeWalletModal}
              className="self-end m-4 p-2 rounded-full bg-gray-600 transition-all cursor-pointer hover:scale-[1.1]"
            >
              <FaTimes />
            </Row>
            <div className="pb-4">
              <p className="px-14 pb-12 text-[24px] mobile:text-[20px] text-center font-medium">
                Connect a wallet on SEI to continue
              </p>
              {wallets.map((wallet, index) => (
                <Row
                  key={`wallet_${index}`}
                  action={() => connectWallet(wallet)}
                  className="px-6 py-2 text-[16px] cursor-pointer transition ease-in-out hover:bg-[#ffffff20]"
                >
                  <Image src={wallet.src} alt={wallet.name} width={32} height={32} />
                  <p className="capitalize text-[18px]">{wallet.name}</p>
                </Row>
              ))}
            </div>
          </Col>
        </Modal>
      )}
    </Transition>
  );
};

export default WalletConnectModal;
