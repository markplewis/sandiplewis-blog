import BlockContent from "@sanity/block-content-to-react";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import {
  authorBioQuery,
  featuredNovelQuery,
  featuredReviewsQuery,
  getRecentPostsQuery
} from "lib/api";
import config from "lib/config";
import { SITE_TITLE } from "lib/constants";
import { urlFor, usePreviewSubscription } from "lib/sanity";
import { client } from "lib/sanity.server";

import Layout from "components/Layout";
import PageTitle from "components/PageTitle";
import ShareTools from "components/ShareTools";

import { getColorData } from "utils/color";

import styles from "pages/styles/home.module.css";

const recentPostsQuery = getRecentPostsQuery(4);

export default function HomePage({ data: initialData }) {
  const { data: novelAndPalette } = usePreviewSubscription(featuredNovelQuery, {
    initialData: initialData?.novelAndPalette,
    enabled: true
  });
  const { data: reviews } = usePreviewSubscription(featuredReviewsQuery, {
    initialData: initialData?.reviews,
    enabled: true
  });
  const { data: posts } = usePreviewSubscription(recentPostsQuery, {
    initialData: initialData?.posts,
    enabled: true
  });
  const { data: author } = usePreviewSubscription(authorBioQuery, {
    initialData: initialData?.author,
    enabled: true
  });

  const { novel, colorPalette } = novelAndPalette;

  const palette = colorPalette ?? "lightVibrant";
  const colorData = getColorData(novel?.image?.palette);
  const baseBgColor = colorData?.[palette]?.base?.background ?? null;
  const baseFgColor = colorData?.[palette]?.base?.foreground ?? null;
  const compBgColor = colorData?.[palette]?.comp?.background ?? null;
  const compFgColor = colorData?.[palette]?.comp?.foreground ?? null;

  return (
    <Layout>
      <Head>
        <title>{SITE_TITLE}</title>
      </Head>

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

      <div
        className={styles.patternBlock}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg' fill='${baseBgColor}' fill-opacity='1' fill-rule='evenodd' clip-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2'%3E%3Cpath d='M4 0h2L0 6V4l4-4zM6 4v2H4l2-2z'/%3E%3C/svg%3E")`
        }}></div>

      <div className={styles.page}>
        {novel ? (
          <div className={styles.novel}>
            {novel?.image ? (
              <div className={styles.novelImage}>
                <Link as={`/novels/${novel?.slug}`} href="/novels/[slug]">
                  <a>
                    <Image
                      src={urlFor(novel?.image).width(188).height(300).url()}
                      width={188}
                      height={300}
                      sizes="(max-width: 800px) 100vw, 188px"
                      layout="responsive"
                      alt={novel?.image?.alt}
                      placeholder="blur"
                      // Data URL generated here: https://png-pixel.com/
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
                    />
                  </a>
                </Link>
              </div>
            ) : null}

            <div className={styles.novelInfo}>
              <PageTitle>{novel?.title}</PageTitle>

              {novel?.overview ? (
                <BlockContent
                  blocks={novel?.overview}
                  projectId={config.projectId}
                  dataset={config.dataset}
                />
              ) : null}

              <Link as={`/novels/${novel?.slug}`} href="/novels/[slug]">
                <a>More</a>
              </Link>
            </div>
          </div>
        ) : null}

        {reviews && reviews.length ? (
          <div className={styles.reviews}>
            {/* <p>Reviews</p> */}
            <ul className={styles.reviewList}>
              {reviews.map(review => (
                <li className={styles.reviewItem} key={review?._id}>
                  <h2 className={styles.reviewTitle}>{review?.title}</h2>
                  <p className={styles.reviewBody}>{review?.review}</p>
                  <p className={styles.reviewAuthor}>— {review?.author}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={styles.shareTools}>
          <ShareTools position="vertical" />
        </div>

        {posts && posts.length ? (
          <div className={styles.posts}>
            <h2 className={styles.postsHeading}>Recent posts</h2>
            <ul className={styles.postList}>
              {posts.map(post => (
                <li className={styles.postItem} key={post?._id}>
                  <Link as={`/posts/${post?.slug}`} href="/posts/[slug]">
                    <a className={styles.postLink}>
                      {post?.image ? (
                        <div className={styles.postImage}>
                          <Image
                            src={urlFor(post?.image).width(83).height(55).url()}
                            width={83}
                            height={55}
                            sizes="(max-width: 800px) 100vw, 83px"
                            layout="responsive"
                            alt={post?.image?.alt}
                            placeholder="blur"
                            // Data URL generated here: https://png-pixel.com/
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
                          />
                        </div>
                      ) : null}
                      <div className={styles.postInfo}>
                        <h3 className={styles.postTitle}>{post?.title}</h3>
                        <p className={styles.postOverview}>{post?.summary}</p>
                      </div>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {author ? (
          <div className={styles.bio}>
            <div className={styles.bioInfo}>
              <h2 className={styles.bioHeading}>Biography</h2>

              {author?.biography ? (
                <BlockContent
                  blocks={author?.biography}
                  projectId={config.projectId}
                  dataset={config.dataset}
                />
              ) : null}

              <Link as={`/authors/${author?.slug}`} href="/authors/[slug]">
                <a>More</a>
              </Link>
            </div>

            {author?.image ? (
              <div className={styles.bioImage}>
                <Image
                  src={urlFor(author?.image).width(188).height(283).url()}
                  width={188}
                  height={283}
                  sizes="(max-width: 800px) 100vw, 283px"
                  layout="responsive"
                  alt={author?.image?.alt}
                  placeholder="blur"
                  // Data URL generated here: https://png-pixel.com/
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Layout>
  );
}

// See: https://nextjs.org/docs/basic-features/data-fetching
// See: https://youtu.be/f1rF9YKm1Ms

export async function getStaticProps() {
  const novelAndPalette = await client.fetch(featuredNovelQuery);
  const reviews = await client.fetch(featuredReviewsQuery);
  const posts = await client.fetch(recentPostsQuery);
  const author = await client.fetch(authorBioQuery);

  return {
    props: {
      data: { novelAndPalette, reviews, posts, author }
    }
  };
}
