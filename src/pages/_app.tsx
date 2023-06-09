import type { AppProps } from "next/app";

import { TempProvider } from "contexts";

import "styles/globals.scss";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <TempProvider>
        <Component {...pageProps} />
      </TempProvider>
    </>
  );
};

export default MyApp;
