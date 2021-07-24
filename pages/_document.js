import Document, { Html, Head, Main, NextScript } from "next/document";

// A custom Document component. See: https://nextjs.org/docs/advanced-features/custom-document

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
