import type { FC } from "react";
import React from "react";
import Head from "next/head";

import type { SeoProps } from "utils/types";

const Seo: FC<SeoProps> = ({ title = "", description = "", image = "", canonical = "" }) => {
  return (
    <Head>
      <title>{title}</title>

      <meta name="title" content={title} />
      <meta property="og:title" content={title} />
      <meta property="twitter:title" content={title} />

      <meta name="description" content={description} key="desc" />
      <meta property="og:description" content={description} />
      <meta property="twitter:description" content={description} />

      <meta name="image" content={image} />
      <meta property="og:image" content={image} />
      <meta property="twitter:image" content={image} />

      {canonical && <link rel="canonical" href={`https://solax.so/${canonical}`} key="canonical" />}
    </Head>
  );
};

export default Seo;
