import Document, { Html, Head, Main, NextScript } from "next/document";

// A custom Document component. See: https://nextjs.org/docs/advanced-features/custom-document

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* See: https://nextjs.org/docs/basic-features/font-optimization */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Asap:ital,wght@0,700;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
