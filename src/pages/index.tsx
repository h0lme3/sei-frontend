import React, { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import { Page } from "components";

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.asPath === "/") {
      router.push("/counter");
    }
  }, [router]);

  return <Page name="default"></Page>;
};

export default Home;
