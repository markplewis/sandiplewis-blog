import PropTypes from "prop-types";

import Head from "next/head";

import Footer from "components/Footer";
import Header from "components/Header";
import PreviewMessage from "components/PreviewMessage";

// See: https://nextjs.org/docs/basic-features/layouts

// `favicon.svg` supports dark mode: https://css-tricks.com/dark-mode-favicons/
// `favicon.ico` and other files were generated from SVG via: https://realfavicongenerator.net/
// TODO: regenerate all of these when I've finalized the design

function Layout({ children, layoutClass = "", description = "", keywords = "" }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#00aba9" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#00aba9" />
        <meta name="theme-color" content="#cccccc" />
        {/* TODO: add OpenGraph meta tags, Twitter cards, etc. */}
      </Head>
      <PreviewMessage />
      <Header />
      <main className={layoutClass}>{children}</main>
      <Footer />
    </>
  );
}
Layout.displayName = "Layout";
Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  layoutClass: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string
};
export default Layout;
