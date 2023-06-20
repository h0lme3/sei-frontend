import type { FC, PropsWithChildren } from "react";

import Header from "./header";
import { Col } from "components";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Col className="min-h-screen">
      <Header />
      <Col className="flex-1 justify-center">{children}</Col>
    </Col>
  );
};

export default Layout;
