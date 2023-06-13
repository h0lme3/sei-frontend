import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { Border, Container, Row, WalletConnectButton } from "components";
import { MENU_LIST } from "utils";

const Header = () => {
  const router = useRouter();

  return (
    <Container>
      <Row className="pt-[14px] pb-[20px] justify-between">
        <a href="https://solax.so" target="_blank" rel="noreferrer noopener" className="relative flex items-center">
          <Image src="/solax_logo.png" alt="SOLA-X Logo" width={127} height={30} priority />
          <div className="absolute top-0 -left-4 w-[180px] h-[20px] bg-[#6481BB90] blur-[50px]" />
        </a>
        <div className="uppercase space-x-[30px] laptop:space-x-[20px] normal:hidden">
          {MENU_LIST.map((menu, index) => (
            <Link
              key={`menu_${index}_${menu.path}`}
              href={menu.path}
              className={`relative animate-border ${router.asPath === menu.path && "font-bold text-label"}`}
            >
              {menu.name}
            </Link>
          ))}
        </div>
        <WalletConnectButton />
      </Row>
      <Border className="border-[#ffffff17]" />
    </Container>
  );
};

export default Header;
