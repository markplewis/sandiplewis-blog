import Document, { Html, Head, Main, NextScript } from "next/document";

// A custom Document component. See: https://nextjs.org/docs/advanced-features/custom-document

// `favicon.svg` supports dark mode: https://css-tricks.com/dark-mode-favicons/
// `favicon.ico` and other files were generated from SVG via: https://realfavicongenerator.net/
// TODO: regenerate all of these when I've finalized the design

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="alternate icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#00aba9" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="msapplication-TileColor" content="#00aba9" />
          <meta name="theme-color" content="#cccccc" />
        </Head>
        {/* TODO: apply `u-font-rendering-fix` class to `body`? */}
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
