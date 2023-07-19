import React from "react";

import { Seo } from "components";

import { SEO_LIST } from "utils";
import type { FC, PageProps } from "types";

const Page: FC<PageProps> = ({ children, name = "default" }) => {
  const getSeoList = () => {
    if (SEO_LIST[name]) {
      return SEO_LIST[name];
    }
  };

  const props = getSeoList();
  return (
    <>
      <Seo {...props} />
      {children}
    </>
  );
};

export default Page;
