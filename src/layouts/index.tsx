import type { FC, PropsWithChildren } from "react";

import Header from "./header";
import { Col } from "components";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Col className="h-screen">
      <Header />
      {children}
    </Col>
  );
};

export default Layout;
