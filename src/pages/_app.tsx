import type { AppProps } from "next/app";

import { ToastContainer } from "react-toastify";

import Layout from "layouts";
import { WalletProvider } from "contexts";

import "react-toastify/dist/ReactToastify.css";
import "styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <WalletProvider autoConnect>
      <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WalletProvider>
  );
};

export default MyApp;
