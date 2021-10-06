import BlockContent from "@sanity/block-content-to-react";

import Image from "next/image";
import Link from "next/link";

import config from "lib/config";
import { urlFor, usePreviewSubscription } from "lib/sanity";
import { client } from "lib/sanity.server";

import Layout from "components/Layout";
import MoreLink from "components/MoreLink";
import PageTitle from "components/PageTitle";
import PostList from "components/PostList";
import ReviewList from "components/ReviewList";
import InternalLink from "components/serializers/InternalLink";
import ShareTools from "components/ShareTools";

import { getPageColors } from "utils/color";
import useMediaQuery from "utils/useMediaQuery";
import { rem } from "utils/units";

import styles from "pages/styles/home.module.css";

const featuredNovelAndHomePageQuery = `*[_type == "homePage"][0] {
  "novel": novel->{
    _id,
    title,
    'slug': slug.current,
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

const authorBioQuery = `*[_type == "homePage"][0].author->{
  name,
  image,
  'slug': slug.current, _id,
  shortBiography[]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => {
        "type": @.reference->_type,
        "slug": @.reference->slug
      }
    }
  }
}`;

const serializers = {
  marks: {
    internalLink: ({ mark, children }) => <InternalLink mark={mark}>{children}</InternalLink>
  }
};

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

  // Colours
  const { base: baseColor, comp: compColor } = getPageColors(novel);

  const isWide = useMediaQuery(`(min-width: ${rem(1280)})`);

  return (
    <Layout
      title=""
      description={description}
      image={{ image: author?.image, portrait: true, crop: true }}>
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

      <div className={styles.gradient}></div>

      {!isWide && (
        <div className={styles.shareTools}>
          <ShareTools text="Sandi Plewis, Author/Editor" />
        </div>
      )}

      <div
        className={styles.patternBlock}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg' fill='${compColor?.background?.hex?.replace(
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
                  serializers={serializers}
                  projectId={config.projectId}
                  dataset={config.dataset}
                />
              ) : null}

              <MoreLink
                as={`/novels/${novel?.slug}`}
                href="/novels/[slug]"
                text="More information"
                fgColor={compColor?.foreground?.hsl}
                bgColor={compColor?.background?.hsl}
              />
            </div>
          </div>
        ) : null}

        {reviews && reviews.length ? (
          <div className={styles.reviews}>
            <ReviewList reviews={reviews} />
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
            <PostList posts={posts} size={isWide ? "large" : "small"} orientation="landscape" />

            <div className={styles.postsMoreLink}>
              <MoreLink as={"/posts"} href="/posts" text="More posts" />
            </div>
          </div>
        ) : null}

        {author ? (
          <div className={styles.bio}>
            {author?.image ? (
              <div className={styles.bioImage}>
                <Image
                  src={urlFor(author?.image).width(376).height(376).url()}
                  width={188}
                  height={188}
                  sizes="(max-width: 800px) 100vw, 188px"
                  layout="responsive"
                  alt={author?.image?.alt}
                  placeholder="blur"
                  // Data URL generated here: https://png-pixel.com/
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
                />
              </div>
            ) : null}

            <div>
              <h2 className={styles.bioHeading}>Sandi Plewis</h2>

              {author?.shortBiography ? (
                <BlockContent
                  blocks={author?.shortBiography}
                  serializers={serializers}
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
