import React, { useEffect } from "react";

import { FaTimes } from "react-icons/fa";
import { Transition } from "react-transition-group";

import Dialogue from "./dialogue.styled";
import { Col, Row } from "components";
import { useWallet } from "contexts";
import { ComponentProps, FC } from "types";

const Modal: FC<ComponentProps> = ({ children }) => {
  const { isWalletModalOpen, closeWalletModal } = useWallet();

  useEffect(() => {
    document.documentElement.style.overflow = isWalletModalOpen ? "hidden" : "auto";
  }, [isWalletModalOpen]);

  const duration = 100;

  return (
    <Transition in={isWalletModalOpen} timeout={duration} unmountOnExit>
      {(state) => (
        <Dialogue
          $state={state}
          className="transition-opacity duration-100 ease-in-out overflow-auto fixed z-50 top-0 w-full h-full py-10 medium:py-0 flex backdrop-blur-md backdrop-brightness-50"
        >
          {/* <div className="absolute top-0 w-full h-full z-10" onClick={closeWalletModal} /> */}
          <Col className="relative z-20 m-auto w-[400px] medium:w-full h-fit medium:min-h-full font-dm_sans text-white rounded-2xl medium:rounded-none bg-modal">
            <Row
              action={closeWalletModal}
              className="self-end m-4 p-2 rounded-full bg-gray-600 transition-all cursor-pointer hover:scale-[1.1]"
            >
              <FaTimes />
            </Row>
            {children}
          </Col>
        </Dialogue>
      )}
    </Transition>
  );
};

export default Modal;
