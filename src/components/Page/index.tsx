import type { FC, PropsWithChildren } from "react";
import React from "react";

import { Seo } from "components";

import { SEO_LIST } from "utils";
import type { PageProps } from "utils/types";

const Page: FC<PropsWithChildren & PageProps> = ({ children, name }) => {
  const getSeoList = () => {
    if (SEO_LIST[name]) {
      return SEO_LIST[name];
    }
  };

  const props = getSeoList();
  return (
    <section>
      <Seo {...props} />
      {children}
    </section>
  );
};

export default Page;
