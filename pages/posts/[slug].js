import { usePreviewSubscription } from "lib/sanity";
import { client } from "lib/sanity.server";

import CoverImage from "components/CoverImage";
import Layout from "components/Layout";
import PageTitle from "components/PageTitle";
import PostBody from "components/PostBody";
import PostMeta from "components/PostMeta";
import ShareTools from "components/ShareTools";

import { getPageColors } from "utils/color";
import { processCreditLine } from "utils/strings";
import useMediaQuery from "utils/useMediaQuery";
import { rem } from "utils/units";

import styles from "pages/styles/post.module.css";

// This page uses a dynamic route. See: https://nextjs.org/docs/routing/dynamic-routes

const postQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "date": publishedAt,
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
    description
  }
`;

export default function Post({ data: initialData }) {
  const { data: post } = usePreviewSubscription(postQuery, {
    params: {
      slug: initialData?.post?.slug
    },
    initialData: initialData?.post,
    enabled: true
  });

  const isWide = useMediaQuery(`(min-width: ${rem(1024)})`);
  const isMedium = useMediaQuery(`(min-width: ${rem(768)})`);

  // 12:9 (Cinemascope) vs 3:2 (Classic Film)
  const cinemaRatio = isWide || !isMedium;
  const imageSize = {
    width: cinemaRatio ? 1240 : 1000,
    height: cinemaRatio ? 531 : 667
  };

  const pageColors = getPageColors(post);

  const creditLine = processCreditLine(post?.image?.creditLine);

  return (
    <Layout
      title={post?.title}
      description={post?.description}
      image={{ image: post?.image, portrait: false, crop: true }}>
      <>
        {/* https://nextjs.org/blog/styling-next-with-styled-jsx */}
        <style jsx global>
          {`
            body {
              ${pageColors.css}
            }
          `}
        </style>

        <article>
          <div className={styles.titleArea}>
            <PageTitle className={styles.title}>{post.title}</PageTitle>
            {isMedium && (
              <div className={styles.shareToolsAbove}>
                <ShareTools text={post.title} />
              </div>
            )}
          </div>

          <div className={styles.heroArea}>
            <div
              className={styles.patternBlock}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg' fill='white' fill-opacity='0.1' fill-rule='evenodd' clip-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2'%3E%3Cpath d='M4 0h2L0 6V4l4-4zM6 4v2H4l2-2z'/%3E%3C/svg%3E")`
              }}></div>

            <CoverImage
              className={styles.coverImage}
              image={post.image}
              title={post.title}
              width={imageSize.width}
              height={imageSize.height}
            />

            <div className={styles.metaAbove}>
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
                <div className={styles.shareToolsBelow}>
                  {<ShareTools text={post.title} align="right" />}
                </div>
                <div className={styles.metaBelow}>
                  <PostMeta creditLine={creditLine} post={post} themed={false} />
                </div>
              </>
            )}
            {post?.body && <PostBody content={post.body} />}
          </div>
        </article>
      </>
    </Layout>
  );
}

// This function gets called at build time on the server side ("Static Generation"). It may be
// called again, via a serverless function ("Incremental Static Regeneration"), if revalidation
// is enabled and a new request comes in (see below). See:
// https://nextjs.org/docs/basic-features/data-fetching/get-static-props
// https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration

export async function getStaticProps({ params }) {
  const post = await client.fetch(postQuery, {
    slug: params.slug
  });
  return {
    props: {
      data: { post }
    },
    // Return a 404 status and page if the post doesn't exist yet or no longer exists
    notFound: !post,
    // When `revalidate` is `false` (its default value) the page will be cached as built until your
    // next build. Otherwise, Next.js will attempt to re-generate the page when a request comes in,
    // once every X seconds (at most).
    revalidate: 10 // In seconds
  };
}

// Specify dynamic routes to pre-render pages based on data.
// This function gets called at build time on the server side ("Static Generation"). It may be
// called again, via a serverless function ("Incremental Static Regeneration"), if the requested
// path has not been generated yet (i.e. when new posts are published after a build). Without this
// mechanism in place, the site would need to be rebuilt every time a new post is published.
// See: https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation

export async function getStaticPaths() {
  // Pre-render only these paths at build time
  const paths = await client.fetch(
    `*[_type == "post" && defined(slug.current)]{ "params": { "slug": slug.current } }`
  );
  // `fallback: blocking` will server-render pages on demand if the path
  // wasn't statically pre-rendered (i.e. didn't exist at build time)
  // https://nextjs.org/docs/basic-features/data-fetching#fallback-blocking
  // https://nextjs.org/docs/basic-features/data-fetching#the-fallback-key-required
  return {
    paths,
    fallback: "blocking"
  };
}

// More information about CSR (Client-Side Rendering), SSR (Server-Side Rendering),
// SSG (Static-Site Generation), and ISR (Incremental Static Regeneration):
// https://youtu.be/f1rF9YKm1Ms
