import BlockContent from "@sanity/block-content-to-react";

// import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import config from "lib/config";
// import { SITE_TITLE } from "lib/constants";
import { urlFor, usePreviewSubscription } from "lib/sanity";
import { client } from "lib/sanity.server";

import Layout from "components/Layout";
import MoreLink from "components/MoreLink";
import PageTitle from "components/PageTitle";
import ShareTools from "components/ShareTools";

import { getColorData } from "utils/color";
import useMediaQuery from "utils/useMediaQuery";
import { rem } from "utils/units";

import styles from "pages/styles/home.module.css";

const featuredNovelAndHomePageQuery = `*[_type == "homePage"][0] {
  "novel": novel->{
    _id,
    title,
    'slug': slug.current,
    overview,
    "image": image{..., ...asset->{
      creditLine,
      description,
      "palette": metadata.palette,
      url
    }},
    colorPalette,
    primaryColor,
    secondaryColor
  },
  description
}`;

const featuredReviewsQuery = `*[_type == "homePage"][0].reviews[]->{review, author, title, _id}`;

function getRecentPostsQuery(limit) {
  return `*[_type == "post"][0..${
    limit - 1
  }] | order(publishedAt desc){title, 'slug': slug.current, image, description, _id}`;
}
const recentPostsQuery = getRecentPostsQuery(3);

const authorBioQuery = `*[_type == "homePage"][0].author->{name, image, shortBiography, 'slug': slug.current, _id}`;

export default function HomePage({ data: initialData }) {
  const { data: novelAndHomePage } = usePreviewSubscription(featuredNovelAndHomePageQuery, {
    initialData: initialData?.novelAndHomePage,
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

  const { novel, description = "" } = novelAndHomePage;
  const { colorPalette, primaryColor, secondaryColor } = novel;
  const palette = colorPalette ?? "lightVibrant";

  const colorData =
    palette === "custom"
      ? getColorData({
          custom: { primary: primaryColor?.hex, secondary: secondaryColor?.hex }
        })
      : getColorData(novel?.image?.palette);

  const baseBgColor = colorData?.[palette]?.base?.background ?? null;
  const baseFgColor = colorData?.[palette]?.base?.foreground ?? null;
  const compBgColor = colorData?.[palette]?.comp?.background ?? null;
  const compFgColor = colorData?.[palette]?.comp?.foreground ?? null;

  const isWide = useMediaQuery(`(min-width: ${rem(1280)})`);

  return (
    <Layout title="" description={description}>
      {/* <Head>
        <title>{SITE_TITLE}</title>
      </Head> */}

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

      <div className={styles.gradient}></div>

      {!isWide && (
        <div className={styles.shareTools}>
          <ShareTools text="Sandi Plewis, Author/Editor" />
        </div>
      )}

      <div
        className={styles.patternBlock}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg' fill='${compBgColor?.replace(
            "#",
            "%23"
          )}' fill-opacity='0.5' fill-rule='evenodd' clip-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2'%3E%3Cpath d='M4 0h2L0 6V4l4-4zM6 4v2H4l2-2z'/%3E%3C/svg%3E")`
        }}></div>

      <div className={styles.page}>
        {novel ? (
          <div className={styles.novel}>
            {novel?.image ? (
              <div className={styles.novelImage}>
                <Link as={`/novels/${novel?.slug}`} href="/novels/[slug]">
                  <a>
                    <Image
                      src={urlFor(novel?.image).width(376).height(581).url()}
                      width={188}
                      height={290}
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

              <MoreLink
                as={`/novels/${novel?.slug}`}
                href="/novels/[slug]"
                text="More information"
                fgColor={compFgColor}
                bgColor={compBgColor}
              />
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

        {isWide && (
          <div className={styles.shareTools}>
            <ShareTools text="Sandi Plewis, Author/Editor" position="vertical" />
          </div>
        )}

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
                            src={urlFor(post?.image).width(166).height(110).url()}
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
                        <p className={styles.postDescription}>{post?.description}</p>
                      </div>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
            <MoreLink as={"/posts"} href="/posts" text="More posts" />
          </div>
        ) : null}

        {author ? (
          <div className={styles.bio}>
            {author?.image ? (
              <div className={styles.bioImage}>
                <Image
                  src={urlFor(author?.image).width(376).height(566).url()}
                  width={188}
                  height={283}
                  sizes="(max-width: 800px) 100vw, 188px"
                  layout="responsive"
                  alt={author?.image?.alt}
                  placeholder="blur"
                  // Data URL generated here: https://png-pixel.com/
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
                />
              </div>
            ) : null}

            <div className={styles.bioInfo}>
              <h2 className={styles.bioHeading}>Biography</h2>

              {author?.shortBiography ? (
                <BlockContent
                  blocks={author?.shortBiography}
                  projectId={config.projectId}
                  dataset={config.dataset}
                />
              ) : null}

              <MoreLink
                as={`/authors/${author?.slug}`}
                href="/authors/[slug]"
                text={`More about ${author?.name?.split(" ")[0]}`}
              />
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}

// See: https://nextjs.org/docs/basic-features/data-fetching
// See: https://youtu.be/f1rF9YKm1Ms

export async function getStaticProps() {
  const novelAndHomePage = await client.fetch(featuredNovelAndHomePageQuery);
  const reviews = await client.fetch(featuredReviewsQuery);
  const posts = await client.fetch(recentPostsQuery);
  const author = await client.fetch(authorBioQuery);

  return {
    props: {
      data: { novelAndHomePage, reviews, posts, author }
    }
  };
}
