import React, { type FC, useEffect } from "react";
import Image from "next/image";

import { FaTimes } from "react-icons/fa";
import { Transition } from "react-transition-group";
import tw from "tailwind-styled-components";

import { Col, Row } from "components";
import { useWallet } from "contexts";
import { wallets } from "utils";

interface ModalProps {
  $state: string;
}

interface WalletConnectModalProps {
  connectWallet: (walletTypeId: number) => void;
}

const Modal = tw.div<ModalProps>`
    /* state === exiting || exited => opacity-0 */
    ${(props) => (props.$state === "entering" || props.$state === "entered" ? "opacity-100" : "opacity-0")}
`;

const WalletConnectModal: FC<WalletConnectModalProps> = ({ connectWallet }) => {
  const { isWalletModalOpen, closeWalletModal } = useWallet();

  useEffect(() => {
    document.documentElement.style.overflow = isWalletModalOpen ? "hidden" : "auto";
  }, [isWalletModalOpen]);

  const duration = 100;

  return (
    <Transition in={isWalletModalOpen} timeout={duration} unmountOnExit>
      {(state) => (
        <Modal
          $state={state}
          className="transition-opacity duration-100 ease-in-out overflow-auto fixed z-50 top-0 w-full h-full py-10 medium:py-0 flex bg-behind"
        >
          <div className="absolute top-0 w-full h-full z-10" onClick={closeWalletModal} />
          <Col className="relative z-20 m-auto w-[400px] medium:w-full h-fit medium:min-h-full font-dm_sans text-white rounded-2xl medium:rounded-none bg-modal">
            <Row
              action={closeWalletModal}
              className="self-end m-4 p-2 rounded-full bg-gray-600 transition-all cursor-pointer hover:scale-[1.1]"
            >
              <FaTimes />
            </Row>
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
          </Col>
        </Modal>
      )}
    </Transition>
  );
};

export default WalletConnectModal;
