import PropTypes from "prop-types";

import Head from "next/head";
import { useRouter } from "next/router";

import Footer from "components/Footer";
import Header from "components/Header";
import PreviewMessage from "components/PreviewMessage";
import SkipLink from "components/SkipLink";

import { BASE_URL, DEFAULT_META_DESCRIPTION, env, envProd, SITE_TITLE } from "lib/constants";
import { urlFor } from "lib/sanity";

import useDebug from "utils/useDebug";

// See: https://nextjs.org/docs/basic-features/layouts

const sizes = {
  twitter: {
    // "Summary Card with Large Image": aspect ratio of 2:1 with minimum dimensions of 300 x 157
    // https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image
    landscape: {
      width: 1200,
      height: 628
    },
    // "Summary Card": apspect ratio of 1:1 with minimum dimensions of 144 x 144
    // https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary
    portrait: {
      width: 600,
      height: 600
    }
  },
  // 1.91:1 aspect ratio (equivalent to 40:21) with minimum dimensions of 1200 x 630
  // https://developers.facebook.com/docs/sharing/webmasters/images/
  facebook: {
    landscape: {
      width: 1200,
      height: 630
    },
    // Roughly 9:14 (becuase 1:1.91 is too narrow for headshots and book covers)
    portrait: {
      width: 770,
      height: 1200
    }
  }
};

function Layout({ children, title = "", description = DEFAULT_META_DESCRIPTION, image = {} }) {
  const debug = useDebug();
  const router = useRouter();
  const url = `${BASE_URL}${router.asPath}`;
  const fullTitle = title ? `${title} | ${SITE_TITLE}` : SITE_TITLE;
  const imageAlt = image?.image?.alt;
  const imageOrientation =
    image?.image && image?.portrait
      ? "portrait"
      : image?.image && !image?.portrait
      ? "landscape"
      : null;

  let twitterImageURL;
  if (imageOrientation === "portrait") {
    if (image.crop) {
      // Crop portrait images into a square shape
      twitterImageURL = urlFor(image.image)
        .width(sizes.twitter.portrait.width)
        .height(sizes.twitter.portrait.height)
        // .fit("crop") // This is the default?
        .url();
    } else {
      // Fit portrait images into a square shape by filling in the background with a solid colour
      twitterImageURL = urlFor(image.image)
        .ignoreImageParams() // Workaround for https://github.com/sanity-io/sanity/issues/524
        .width(sizes.twitter.portrait.width)
        .height(sizes.twitter.portrait.height)
        .fit("fill")
        .bg(image?.image?.palette?.vibrant?.background?.replace("#", "") ?? "666") // TODO: not working
        .url();
    }
  } else if (imageOrientation === "landscape") {
    twitterImageURL = urlFor(image.image)
      .width(sizes.twitter.landscape.width)
      .height(sizes.twitter.landscape.height)
      .url();
  }

  let facebookImageURL;
  if (imageOrientation === "portrait") {
    facebookImageURL = urlFor(image.image)
      .width(sizes.facebook.portrait.width)
      .height(sizes.facebook.portrait.height)
      .url();
  } else if (imageOrientation === "landscape") {
    facebookImageURL = urlFor(image.image)
      .width(sizes.facebook.landscape.width)
      .height(sizes.facebook.landscape.height)
      .url();
  }

  debug && console.log(`env: ${env}`);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
        {envProd ? null : <meta name="robots" content="noindex" />}
        <title>{fullTitle}</title>
        {description && <meta name="description" content={description} />}

        {/* Icons */}
        {/* `favicon.svg` supports dark mode: https://css-tricks.com/dark-mode-favicons/ */}
        {/* `favicon.ico` and other files were generated from SVG via: https://realfavicongenerator.net/ */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#305975" />
        <meta name="msapplication-TileColor" content="#305975" />
        <meta name="theme-color" content="#305975" />

        {/* Twitter */}
        {/* https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary */}
        <meta
          name="twitter:card"
          content={
            twitterImageURL && imageOrientation === "landscape" ? "summary_large_image" : "summary"
          }
        />
        <meta name="twitter:site" content="@SandiPlewis" />
        <meta name="twitter:title" content={title || SITE_TITLE} />
        <meta name="twitter:description" content={description} />
        {twitterImageURL && <meta name="twitter:image" content={twitterImageURL} />}
        {twitterImageURL && imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}

        {/* Facebook */}
        {/* https://developers.facebook.com/docs/sharing/webmasters/ */}
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title || SITE_TITLE} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        {facebookImageURL && imageOrientation && (
          <>
            <meta property="og:image" content={facebookImageURL} />
            <meta property="og:image:width" content={sizes.facebook[imageOrientation].width} />
            <meta property="og:image:height" content={sizes.facebook[imageOrientation].height} />
          </>
        )}
        {facebookImageURL && imageAlt && <meta name="og:image:alt" content={imageAlt} />}
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
