import type { AppProps } from "next/app";

import Layout from "layouts";
import { WalletProvider } from "contexts";

import "styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <WalletProvider autoConnect>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WalletProvider>
  );
};

export default MyApp;
