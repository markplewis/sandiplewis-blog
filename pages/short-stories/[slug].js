import BlockContent from "@sanity/block-content-to-react";

import ErrorPage from "next/error";
import { useRouter } from "next/router";

import config from "lib/config";
import { usePreviewSubscription } from "lib/sanity";
import { client } from "lib/sanity.server";

import CoverImage from "components/CoverImage";
import Layout from "components/Layout";
import PageTitle from "components/PageTitle";
import PostBody from "components/PostBody";
import InternalLink from "components/serializers/InternalLink";
import ShareTools from "components/ShareTools";

import { getPageColors } from "utils/color";
import useMediaQuery from "utils/useMediaQuery";
import { rem } from "utils/units";

import styles from "pages/styles/novelAndShortStory.module.css";

const query = `
  *[_type == "shortStory" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    colorPalette,
    primaryColor,
    secondaryColor,
    "image": image{..., ...asset->{
      creditLine,
      description,
      "palette": metadata.palette,
      url
    }},
    "overview": overview[] {
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => {
          "type": @.reference->_type,
          "slug": @.reference->slug
        }
      }
    },
    "body": body[] {
      ...,
      _type == "image" => {
        ...,
        "asset": asset->
      },
      markDefs[]{
        ...,
        _type == "internalLink" => {
          "type": @.reference->_type,
          "slug": @.reference->slug
        }
      }
    },
    description
  }
`;

const serializers = {
  marks: {
    internalLink: ({ mark, children }) => <InternalLink mark={mark}>{children}</InternalLink>
  }
};

export default function ShortStory({ data: initialData }) {
  const router = useRouter();

  const { data: shortStory } = usePreviewSubscription(query, {
    params: {
      slug: initialData?.slug
    },
    initialData,
    enabled: true
  });

  const isWide = useMediaQuery(`(min-width: ${rem(1024)})`);
  const isMedium = useMediaQuery(`(min-width: ${rem(768)})`);

  // Colours
  const { base: baseColor, comp: compColor } = getPageColors(shortStory);

  const overview = shortStory?.overview ? (
    <>
      <PageTitle className={styles.title}>{shortStory?.title}</PageTitle>
      <BlockContent
        blocks={shortStory?.overview}
        serializers={serializers}
        projectId={config.projectId}
        dataset={config.dataset}
      />
    </>
  ) : null;

  return !router.isFallback && !shortStory?.slug ? (
    <ErrorPage statusCode={404} />
  ) : (
    <Layout
      title={shortStory?.title}
      description={shortStory?.description}
      image={{ image: shortStory?.image, portrait: true, crop: false }}>
      <style jsx global>
        {`
          body {
            --baseBgColor: ${baseColor?.background?.hsl};
            --baseFgColor: ${baseColor?.foreground?.hsl};
            --compBgColor: ${compColor?.background?.hsl};
            --compFgColor: ${compColor?.foreground?.hsl};
          }
        `}
      </style>

      <div className={styles.page}>
        <div className={styles.heroArea}>
          <div
            className={styles.patternBlock}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg' fill='${compColor?.background?.hex?.replace(
                "#",
                "%23"
              )}' fill-opacity='0.5' fill-rule='evenodd' clip-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2'%3E%3Cpath d='M4 0h2L0 6V4l4-4zM6 4v2H4l2-2z'/%3E%3C/svg%3E")`
            }}></div>

          <div className={styles.coverImageAndInfo}>
            <CoverImage
              className={styles.coverImage}
              image={shortStory?.image}
              title={shortStory?.title}
              url={shortStory?.image}
              width={376}
              height={600}
            />
            {isMedium && <div className={`${styles.info} ${styles.infoAbove}`}>{overview}</div>}
            {isWide && (
              <div className={styles.shareTools}>
                <ShareTools text={shortStory?.title} position="vertical" />
              </div>
            )}
          </div>

          <div
            className={styles.patternBlock2}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${compColor?.background?.hex?.replace(
                "#",
                "%23"
              )}' fill-opacity='0.5' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
        </div>

        <div className={styles.bodyArea}>
          {!isWide && (
            <div className={styles.shareTools}>
              <ShareTools text={shortStory?.title} position="below" />
            </div>
          )}
          {!isMedium && <div className={`${styles.info} ${styles.infoBelow}`}>{overview}</div>}

          {shortStory?.body && <PostBody content={shortStory.body} />}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const data = await client.fetch(query, { slug: params.slug });
  return {
    props: {
      data
    }
  };
}

export async function getStaticPaths() {
  const paths = await client.fetch(
    `*[_type == "shortStory" && defined(slug.current)]{ "params": { "slug": slug.current } }`
  );
  return {
    paths,
    fallback: true
  };
}
