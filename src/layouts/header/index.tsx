import React from "react";

import { Row, WalletConnectButton } from "components";

const Header = () => {
  return (
    <Row className="p-4 self-end">
      <WalletConnectButton />
    </Row>
  );
};

export default Header;
