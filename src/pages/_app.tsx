import type { AppProps } from "next/app";

import { ToastContainer } from "react-toastify";

import Layout from "layouts";
import { Loading } from "components";
import { MainProvider, WalletProvider } from "contexts";

import "react-toastify/dist/ReactToastify.css";
import "styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <MainProvider>
      <WalletProvider autoConnect>
        <Loading />
        <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WalletProvider>
    </MainProvider>
  );
};

export default MyApp;
