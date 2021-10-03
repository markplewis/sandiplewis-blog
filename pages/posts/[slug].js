import ErrorPage from "next/error";
import { useRouter } from "next/router";

import { usePreviewSubscription } from "lib/sanity";
import { client } from "lib/sanity.server";

// import Comments from "components/Comments";
// import CommentForm from "components/CommentForm";
import CoverImage from "components/CoverImage";
import Layout from "components/Layout";
import PageTitle from "components/PageTitle";
import PostBody from "components/PostBody";
import PostMeta from "components/PostMeta";
import ShareTools from "components/ShareTools";

import { getColorData } from "utils/color";
import { processCreditLine } from "utils/strings";
import useMediaQuery from "utils/useMediaQuery";
import { rem } from "utils/units";

import styles from "pages/styles/post.module.css";

// This page uses a dynamic route. See: https://nextjs.org/docs/routing/dynamic-routes

// const commentsEnabledQuery = `*[_type == "settings"][0].commentsEnabled`;

const postQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "date": publishedAt,
    "slug": slug.current,
    colorPalette,
    "image": image{..., ...asset->{
      creditLine,
      description,
      "palette": metadata.palette,
      url
    }},
    "author": author->{name, "slug": slug.current, "picture": image.asset->url},
    "categories": categories[]->{title, "slug": slug.current},
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
    description,
    "comments": *[
      _type == "comment" &&
      post._ref == ^._id &&
      approved == true
    ] {
      _id,
      name,
      email,
      comment,
      _createdAt
    }
  }
`;

export default function Post({ data: initialData }) {
  const router = useRouter();

  // If we wanted to, we could use Next's cookie-based preview mode
  // instead or Sanity's live subscription-based preview feature:
  // https://nextjs.org/docs/advanced-features/preview-mode#fetch-preview-data

  // Documentation and references:
  // https://www.npmjs.com/package/next-sanity/v/0.1.4
  // https://www.sanity.io/blog/live-preview-with-nextjs

  const { data: post } = usePreviewSubscription(postQuery, {
    params: {
      slug: initialData?.post?.slug
    },
    initialData: initialData?.post,
    enabled: true
  });

  // const { data: commentsEnabled } = usePreviewSubscription(commentsEnabledQuery, {
  //   initialData: initialData?.commentsEnabled,
  //   enabled: true
  // });

  const isWide = useMediaQuery(`(min-width: ${rem(1024)})`);
  const isMedium = useMediaQuery(`(min-width: ${rem(768)})`);

  // 12:9 (Cinemascope) vs 3:2 (Classic Film)
  const cinemaRatio = isWide || !isMedium;
  const imageSize = {
    width: cinemaRatio ? 1240 : 1000,
    height: cinemaRatio ? 531 : 667
  };

  const colorPalette = post?.colorPalette ?? "darkVibrant";
  const colorData = getColorData(post?.image?.palette);
  const baseBgColor = colorData?.[colorPalette]?.base?.background ?? null;
  const baseFgColor = colorData?.[colorPalette]?.base?.foreground ?? null;
  const compBgColor = colorData?.[colorPalette]?.comp?.background ?? null;
  const compFgColor = colorData?.[colorPalette]?.comp?.foreground ?? null;

  const creditLine = processCreditLine(post?.image?.creditLine);

  return !router.isFallback && !post?.slug ? (
    <ErrorPage statusCode={404} />
  ) : (
    <Layout
      title={post?.title}
      description={post?.description}
      image={{ image: post?.image, portrait: false, crop: true }}>
      {router.isFallback ? (
        <PageTitle>Loading…</PageTitle>
      ) : (
        <>
          {/* https://nextjs.org/blog/styling-next-with-styled-jsx */}
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

          <article className={styles.article}>
            <div className={styles.titleAndShareTools}>
              <PageTitle className={styles.title}>{post.title}</PageTitle>
              {isMedium && <ShareTools text={post.title} position="above" />}
            </div>

            <div className={styles.coverImageAndMeta}>
              <div
                className={styles.patternBlock}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg' fill='white' fill-opacity='0.1' fill-rule='evenodd' clip-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2'%3E%3Cpath d='M4 0h2L0 6V4l4-4zM6 4v2H4l2-2z'/%3E%3C/svg%3E")`
                }}></div>

              <CoverImage
                className={styles.coverImage}
                image={post.image}
                title={post.title}
                url={post.image}
                width={imageSize.width}
                height={imageSize.height}
              />

              <div className={`${styles.meta} ${styles.metaAbove}`}>
                {isMedium && <PostMeta creditLine={creditLine} post={post} themed={true} />}
              </div>

              <div
                className={styles.patternBlock2}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
            </div>

            <div className={styles.bodyArea}>
              {!isMedium && (
                <>
                  {<ShareTools text={post.title} position="below" />}
                  <div className={`${styles.meta} ${styles.metaBelow}`}>
                    <PostMeta creditLine={creditLine} post={post} themed={false} />
                  </div>
                </>
              )}
              {post?.body && <PostBody content={post.body} />}
            </div>
          </article>

          {/* {commentsEnabled ? (
            <>
              <Comments comments={post.comments} />
              <CommentForm _id={post._id} />
            </>
          ) : null} */}
        </>
      )}
    </Layout>
  );
}

// See: https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation

export async function getStaticProps({ params }) {
  const post = await client.fetch(postQuery, {
    slug: params.slug
  });
  // const commentsEnabled = await client.fetch(commentsEnabledQuery);

  return {
    props: {
      data: {
        post
        // commentsEnabled
      }
    }
    // revalidate: 1 // TODO: is this necessary?
  };
}

// See: https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation

export async function getStaticPaths() {
  const paths = await client.fetch(
    `*[_type == "post" && defined(slug.current)]{ "params": { "slug": slug.current } }`
  );
  return {
    paths,
    // See: https://nextjs.org/docs/basic-features/data-fetching#the-fallback-key-required
    fallback: true
  };
}
