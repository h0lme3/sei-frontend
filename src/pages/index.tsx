import React from "react";
import type { GetServerSideProps, NextPage } from "next";

import { Page } from "components";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/counter",
      permanent: false,
    },
  };
};

const Home: NextPage = () => {
  return <Page name="default" />;
};

export default Home;
