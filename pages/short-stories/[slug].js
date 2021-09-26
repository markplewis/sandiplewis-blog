import BlockContent from "@sanity/block-content-to-react";

import ErrorPage from "next/error";
import { useRouter } from "next/router";

import config from "lib/config";
import { usePreviewSubscription } from "lib/sanity";
import { client } from "lib/sanity.server";

import CoverImage from "components/CoverImage";
import Layout from "components/Layout";
import PageTitle from "components/PageTitle";
import PostBodyImage from "components/serializers/PostBodyImage";
import ShareTools from "components/ShareTools";

import { getColorData } from "utils/color";
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
    overview,
    body,
    description
  }
`;

export default function ShortStory({ data: initialData }) {
  const router = useRouter();

  const { data: shortStory } = usePreviewSubscription(query, {
    params: {
      slug: initialData?.slug
    },
    initialData,
    enabled: true
  });

  const serializers = {
    types: {
      // eslint-disable-next-line react/display-name
      image: ({ node }) => <PostBodyImage node={node} />
    }
  };

  const isWide = useMediaQuery(`(min-width: ${rem(1024)})`);
  const isMedium = useMediaQuery(`(min-width: ${rem(768)})`);

  const palette = shortStory?.colorPalette ?? "darkVibrant";
  const colorData =
    palette === "custom"
      ? getColorData({
          custom: {
            primary: shortStory?.primaryColor?.hex,
            secondary: shortStory?.secondaryColor?.hex
          }
        })
      : getColorData(shortStory?.image?.palette);

  const baseBgColor = colorData?.[palette]?.base?.background ?? null;
  const baseFgColor = colorData?.[palette]?.base?.foreground ?? null;
  const compBgColor = colorData?.[palette]?.comp?.background ?? null;
  const compFgColor = colorData?.[palette]?.comp?.foreground ?? null;

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
            --baseBgColor: ${baseBgColor};
            --baseFgColor: ${baseFgColor};
            --compBgColor: ${compBgColor};
            --compFgColor: ${compFgColor};
          }
        `}
      </style>

      <div className={styles.page}>
        <div className={styles.heroArea}>
          <div
            className={styles.patternBlock}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg' fill='${compBgColor?.replace(
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
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${compBgColor?.replace(
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
          <div className={styles.body}>
            {shortStory?.body && (
              <>
                <BlockContent
                  blocks={shortStory?.body}
                  serializers={serializers}
                  projectId={config.projectId}
                  dataset={config.dataset}
                />
              </>
            )}
          </div>
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
