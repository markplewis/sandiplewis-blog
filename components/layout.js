import Head from "next/head";

import Footer from "components/footer";
import Header from "components/header";

// See: https://nextjs.org/docs/basic-features/layouts

// `favicon.svg` supports dark mode: https://css-tricks.com/dark-mode-favicons/
// `favicon.ico` and other files were generated from SVG via: https://realfavicongenerator.net/
// TODO: regenerate all of these when I've finalized the design

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content="" />
        <meta name="keywords" content="" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#00aba9" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#00aba9" />
        <meta name="theme-color" content="#cccccc" />
        {/* TODO: add OpenGraph meta tags, Twitter cards, etc. */}
      </Head>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
