import PropTypes from "prop-types";

import Head from "next/head";
import { useRouter } from "next/router";

import Footer from "components/Footer";
import Header from "components/Header";
import PreviewMessage from "components/PreviewMessage";
import SkipLink from "components/SkipLink";

import { BASE_URL, DEFAULT_META_DESCRIPTION, SITE_TITLE } from "lib/constants";
import { urlFor } from "lib/sanity";

// See: https://nextjs.org/docs/basic-features/layouts

// `favicon.svg` supports dark mode: https://css-tricks.com/dark-mode-favicons/
// `favicon.ico` and other files were generated from SVG via: https://realfavicongenerator.net/
// TODO: regenerate all of these when I've finalized the design

const imageSizes = {
  // Roughly 9:14
  portrait: {
    width: 770,
    height: 1200
  },
  // 1.91:1 (as recommended by https://www.kapwing.com/resources/what-is-an-og-image-make-and-format-og-images-for-your-blog-or-webpage/)
  landscape: {
    width: 1200,
    height: 630
  }
};

function Layout({ children, title = "", description = DEFAULT_META_DESCRIPTION, image = {} }) {
  const router = useRouter();
  const url = `${BASE_URL}${router.asPath}`;
  const fullTitle = title ? `${title} | ${SITE_TITLE}` : SITE_TITLE;
  let imageOrientation;
  let imageURL;

  if (image.url && image.portrait) {
    imageOrientation = "portrait";
    imageURL = urlFor(image.url)
      .width(imageSizes.portrait.width)
      .height(imageSizes.portrait.height)
      .url();
  } else if (image.url && !image.portrait) {
    imageOrientation = "landscape";
    imageURL = urlFor(image.url)
      .width(imageSizes.landscape.width)
      .height(imageSizes.landscape.height)
      .url();
  }
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
        {/* TODO: replace this with the line below it */}
        <meta name="robots" content="noindex" />
        <title>{fullTitle}</title>
        {/* {process.env.NODE_ENV === "production" ? null : <meta name="robots" content="noindex" />} */}
        {description && <meta name="description" content={description} />}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#00aba9" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#00aba9" />
        <meta name="theme-color" content="#cccccc" />
        {/* TODO: add OpenGraph meta tags, Twitter cards, etc. */}
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title || SITE_TITLE} />
        <meta property="og:description" content={description} />
        {imageURL && imageOrientation && (
          <>
            <meta property="og:image" content={imageURL} />
            <meta property="og:image:width" content={imageSizes[imageOrientation].width} />
            <meta property="og:image:height" content={imageSizes[imageOrientation].height} />
          </>
        )}
      </Head>
      <SkipLink />
      <Header>
        <PreviewMessage />
      </Header>
      <main>{children}</main>
      <Footer />
    </>
  );
}
Layout.displayName = "Layout";
Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  description: PropTypes.string
};
export default Layout;
