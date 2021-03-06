import Image from "next/image";
import Link from "next/link";

import { PortableText, urlFor, usePreviewSubscription } from "lib/sanity";
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
  return `*[_type == "post"] | order(publishedAt desc){title, 'slug': slug.current, image, description, _id} [0..${
    limit - 1
  }]`;
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

  // TODO: convert this into a hook that returns a `<style jsx global>` component
  const pageColors = getPageColors(novel);

  const isMedium = useMediaQuery(`(min-width: ${rem(520)}) and (max-width: ${rem(1149)})`);
  const isWide = useMediaQuery(`(min-width: ${rem(1280)})`);
  const largePostImages = isMedium || isWide;

  const smallAuthorImage = useMediaQuery(`(min-width: ${rem(1150)}) and (max-width: ${rem(1279)})`);
  const authorImageSize = smallAuthorImage ? 140 : 175;

  return (
    <Layout
      title=""
      description={description}
      image={{ image: author?.image, portrait: true, crop: true }}
      className="homePage">
      <style jsx global>
        {`
          body {
            ${pageColors.css}
          }
        `}
      </style>

      <div className={styles.gradient}></div>

      {!isWide && (
        <div className={styles.shareToolsAbove}>
          <ShareTools text="Sandi Plewis, Author/Editor" align="right" />
        </div>
      )}

      <div
        className={styles.patternBlock}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg' fill='${pageColors?.secondaryBgLow?.replace(
            "#",
            "%23"
          )}' fill-opacity='0.6' fill-rule='evenodd' clip-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2'%3E%3Cpath d='M4 0h2L0 6V4l4-4zM6 4v2H4l2-2z'/%3E%3C/svg%3E")`
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
                <PortableText blocks={novel?.overview} serializers={serializers} />
              ) : null}

              <MoreLink
                as={`/novels/${novel?.slug}`}
                href="/novels/[slug]"
                text="More information"
                fgColor={pageColors?.secondaryFgHigh}
                bgColor={pageColors?.secondaryBgHigh}
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
          <div className={styles.shareToolsVertical}>
            <ShareTools text="Sandi Plewis, Author/Editor" position="vertical" />
          </div>
        )}

        {posts && posts.length ? (
          <div className={styles.posts}>
            <h2 className={styles.postsHeading}>Recent posts</h2>
            <PostList
              posts={posts}
              size={largePostImages ? "large" : "small"}
              orientation="landscape"
            />
            <div className={styles.postsMoreLink}>
              <MoreLink as={"/posts"} href="/posts" text="More posts" />
            </div>
          </div>
        ) : null}

        {author ? (
          <div className={styles.bio}>
            {author?.image ? (
              <div className={styles.bioImage} style={{ maxWidth: rem(authorImageSize) }}>
                <Image
                  src={urlFor(author?.image)
                    .width(authorImageSize * 2)
                    .height(authorImageSize * 2)
                    .url()}
                  width={authorImageSize}
                  height={authorImageSize}
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
                <PortableText blocks={author?.shortBiography} serializers={serializers} />
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

export async function getStaticProps() {
  const novelAndHomePage = await client.fetch(featuredNovelAndHomePageQuery);
  const reviews = await client.fetch(featuredReviewsQuery);
  const posts = await client.fetch(recentPostsQuery);
  const author = await client.fetch(authorBioQuery);

  return {
    props: {
      data: { novelAndHomePage, reviews, posts, author }
    },
    revalidate: 10
  };
}
