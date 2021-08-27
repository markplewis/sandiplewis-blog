import ErrorPage from "next/error";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { SITE_TITLE } from "lib/constants";
import { usePreviewSubscription } from "lib/sanity";
import { client } from "lib/sanity.server";

import PostBody from "components/PostBody";
// import PostHeader from "components/PostHeader";
import Comments from "components/Comments";
import CommentForm from "components/CommentForm";
import Layout from "components/Layout";
import PostTitle from "components/PostTitle";
// import Avatar from "components/Avatar";
import Date from "components/Date";
import CoverImage from "components/CoverImage";

import { getColorData } from "utils/color";
// import useDebug from "utils/useDebug";

import styles from "pages/styles/post.module.css";

// This page uses a dynamic route. See: https://nextjs.org/docs/routing/dynamic-routes

const commentsEnabledQuery = `*[_type == "settings"][0].commentsEnabled`;

// Extract a limited set of colour palettes
// "palette": {
//   "vibrant": metadata.palette.vibrant,
//   "darkVibrant": metadata.palette.darkVibrant,
//   "lightVibrant": metadata.palette.lightVibrant
// },

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
    body,
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
  // const debug = useDebug();

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

  const { data: commentsEnabled } = usePreviewSubscription(commentsEnabledQuery, {
    initialData: initialData?.commentsEnabled,
    enabled: true
  });

  const colorPalette = post?.colorPalette ?? "darkVibrant";
  const colorData = getColorData(post?.image?.palette);
  const baseBgColor = colorData?.[colorPalette]?.base?.background ?? null;
  const baseFgColor = colorData?.[colorPalette]?.base?.foreground ?? null;
  const compBgColor = colorData?.[colorPalette]?.comp?.background ?? null;
  const compFgColor = colorData?.[colorPalette]?.comp?.foreground ?? null;

  return !router.isFallback && !post?.slug ? (
    <ErrorPage statusCode={404} />
  ) : (
    // TODO: pass page meta description, keywords, etc. to <Layout>
    <Layout>
      {router.isFallback ? (
        <PostTitle>Loading…</PostTitle>
      ) : (
        <>
          <Head>
            <title>
              {post.title} | {SITE_TITLE}
            </title>
            {/* <meta property="og:image" content={post.ogImage.url} /> */}
          </Head>

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

          <article className={styles.post}>
            {/* <PostHeader
              title={post.title}
              image={post.image}
              date={post.date}
              author={post.author}
            /> */}

            <div className={styles.titleAndShareTools}>
              <PostTitle className={styles.title}>{post.title}</PostTitle>

              <div className={styles.shareTools}>
                <Link href="https://www.facebook.com">
                  <a className={styles.shareTool}>
                    <span className="u-visually-hidden">Facebook</span>
                  </a>
                </Link>
                <Link href="https://www.twitter.com">
                  <a className={styles.shareTool}>
                    <span className="u-visually-hidden">Twitter</span>
                  </a>
                </Link>
                <Link href="mailto:someone@example.com">
                  <a className={styles.shareTool}>
                    <span className="u-visually-hidden">Email</span>
                  </a>
                </Link>
              </div>
            </div>

            <div className={styles.coverImageAndMeta}>
              <CoverImage
                className={styles.coverImage}
                image={post.image}
                title={post.title}
                url={post.image}
              />

              <div className={styles.meta}>
                <Date className={styles.date} dateString={post.date} />
                <p>
                  <Link as={`/authors/${post.author?.slug}`} href="/authors/[slug]">
                    <a className={styles.author}>{post.author?.name}</a>
                  </Link>
                </p>

                {/* <Avatar
                  name={post.author?.name}
                  slug={post.author?.slug}
                  picture={post.author?.picture}
                /> */}

                {post.categories && post.categories.length ? (
                  <div className={styles.categories}>
                    <p className={styles.categoriesHeading}>Categories</p>
                    <ul className={styles.categoryList}>
                      {post.categories.map(({ slug, title }) => (
                        <li className={styles.categoryItem} key={slug}>
                          <Link as={`/categories/${slug}`} href="/categories/[slug]">
                            <a className={styles.category}>{title}</a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {post.tags && post.tags.length ? (
                  <p className={styles.tags}>Tags: {post.tags.map(tag => tag.label).join(", ")}</p>
                ) : null}

                {post.image?.creditLine && (
                  <p className={styles.credit}>Photo credit: {post.image.creditLine}</p>
                )}
              </div>
            </div>

            <PostBody className={styles.body} content={post.body} />
          </article>

          {commentsEnabled ? (
            <>
              <Comments comments={post.comments} />
              <CommentForm _id={post._id} />
            </>
          ) : null}
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
  const commentsEnabled = await client.fetch(commentsEnabledQuery);

  return {
    props: {
      data: {
        post,
        commentsEnabled
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
