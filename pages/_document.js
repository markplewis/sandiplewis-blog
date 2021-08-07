import Document, { Html, Head, Main, NextScript } from "next/document";

// A custom Document component. See: https://nextjs.org/docs/advanced-features/custom-document

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        {/* TODO: apply `u-font-rendering-fix` class to `body`? */}
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
