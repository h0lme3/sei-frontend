import type { NextPage } from "next";

import { Page } from "components";
import { CounterView } from "views";

const Home: NextPage = () => {
  return (
    <Page name="counter">
      <CounterView />
    </Page>
  );
};

export default Home;
