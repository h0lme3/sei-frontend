import type { NextPage } from "next";

import { Page } from "components";
import { ProView } from "views";

const Home: NextPage = () => {
  return (
    <Page name="counter">
      <ProView />
    </Page>
  );
};

export default Home;
