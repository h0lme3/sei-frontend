import React, { useState } from "react";
import Image from "next/image";

import { useDetectClickOutside } from "react-detect-click-outside";

import { Button, Row } from "components";
import { useWallet } from "contexts";
import { shortenWalletAddress, WALLET_LIST } from "utils";
import type { ExtraTWClassProps } from "types";

const WalletDropDown = ({ className = "" }: ExtraTWClassProps) => {
  const { senderAddress, wallet, walletId, openWalletModal, disconnectWallet } = useWallet();

  const [copied, setCopied] = useState(false);
  const [displayDropdown, setDisplayDropdown] = useState(false);

  const closeDropdown = () => setDisplayDropdown(false);

  const ref = useDetectClickOutside({ onTriggered: closeDropdown });

  const copyAddress = () => {
    if (senderAddress) {
      navigator.clipboard.writeText(senderAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 400);
    }
  };

  const options = [
    { name: `${copied ? "Copied" : "Copy Address"}`, action: copyAddress },
    {
      name: "Change Wallet",
      action: () => {
        openWalletModal("wallet_connect");
        closeDropdown();
      },
    },
    {
      name: "Disconnect",
      action: () => {
        disconnectWallet();
        closeDropdown();
      },
    },
  ];

  return (
    <div ref={ref}>
      <Button
        action={() => (wallet ? setDisplayDropdown(!displayDropdown) : openWalletModal("wallet_connect"))}
        className={className}
      >
        {wallet ? (
          <Row>
            {!!walletId && (
              <Image
                src={WALLET_LIST[walletId - 1].src}
                alt={WALLET_LIST[walletId - 1].name}
                width={24}
                height={24}
                priority
              />
            )}
            <p>{shortenWalletAddress(senderAddress)}</p>
          </Row>
        ) : (
          "Select Wallet"
        )}
      </Button>
      {displayDropdown && (
        <div className={`wallet-adapter-dropdown-list ${displayDropdown && "wallet-adapter-dropdown-list-active"}`}>
          {options.map((option, index) => (
            <Row
              key={`option_${index}`}
              action={option.action}
              className="justify-center border-none outline-none cursor-pointer whitespace-nowrap px-5 py-0 w-full h-9 rounded-md text-[14px] text-white font-semibold hover:bg-opacity-80"
            >
              {option.name}
            </Row>
          ))}
        </div>
      )}
    </div>
  );
};

export default WalletDropDown;
