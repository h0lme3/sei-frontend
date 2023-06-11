import type { DocumentContext, DocumentInitialProps } from "next/document";
import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

const gtag = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`;
export default class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html lang="en" className="bg-black text-white">
        <Head>
          {/* meta tags for SEO */}
          <meta httpEquiv="Cache-control" content="max-age=3153600" />
          <meta name="title" content="SOLA-X | The fully comprehensive smart liquidity DeFi hub" />
          <meta
            name="description"
            content="SOLA-X offers the most frictionless DeFi experience for traders and LPs powered by a new generation of liquidity."
            key="desc"
          />
          <meta name="keywords" content="sola-x, dex, swap, solana, sei" />
          <meta property="og:url" content="https://solax.so/" />
          <meta property="og:type" content="DEX platform" />
          <meta property="og:site_name" content="SOLA-X" />

          <link rel="publisher" href="https://solax.so" />
          <meta name="robots" content="index,follow" />
          <meta name="GOOGLEBOT" content="index,follow" />

          {/* font */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Encode+Sans:wght@100;200;300;400;500;600;700;800;900&display=optional"
          ></link>
          <link
            href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
            rel="stylesheet"
          />

          {/* icon */}
          <link rel="icon" href="/sola-x.ico" type="image/ico" />

          {/* google tagmanager and google analytics*/}
          {process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
            <>
              <Script async src={gtag} strategy="beforeInteractive" />
              <Script
                id="google-analytics"
                dangerouslySetInnerHTML={{
                  __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments)}
              gtag("js", new Date());
              gtag("config", '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
            `,
                }}
                strategy="beforeInteractive"
              />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
