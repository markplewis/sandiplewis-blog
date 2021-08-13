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

import "pages/styles/home.module.css";

const recentPostsQuery = getRecentPostsQuery(4);

export default function HomePage({ data: initialData }) {
  const { data: novel } = usePreviewSubscription(featuredNovelQuery, {
    initialData: initialData?.novel,
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

  return (
    <Layout layoutClass="l-home">
      <Head>
        <title>{SITE_TITLE}</title>
      </Head>

      <h2>Home page</h2>

      {novel ? (
        <div className="novel" style={{ border: "1px solid black", padding: "10px" }}>
          {novel?.image ? (
            <div style={{ width: "200px" }}>
              <Link as={`/novels/${novel?.slug}`} href="/novels/[slug]">
                <a>
                  <Image
                    src={urlFor(novel?.image).width(1240).height(540).url()}
                    width={1240}
                    height={540}
                    sizes="(max-width: 800px) 100vw, 800px"
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

          <p>{novel?.title}</p>

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
      ) : null}

      {reviews && reviews.length ? (
        <div className="reviews" style={{ border: "1px solid black", padding: "10px" }}>
          <p>Reviews</p>
          <ul>
            {reviews.map(review => (
              <li key={review?._id}>
                <p>{review?.title}</p>
                <p>{review?.review}</p>
                <p>- {review?.author}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {posts && posts.length ? (
        <div className="posts" style={{ border: "1px solid black", padding: "10px" }}>
          <p>Recent posts</p>
          <ul>
            {posts.map(post => (
              <li key={post?._id}>
                <div style={{ width: "200px" }}>
                  <Link as={`/posts/${post?.slug}`} href="/posts/[slug]">
                    <a>
                      {post?.image ? (
                        <Image
                          src={urlFor(post?.image).width(1240).height(540).url()}
                          width={1240}
                          height={540}
                          sizes="(max-width: 800px) 100vw, 800px"
                          layout="responsive"
                          alt={post?.image?.alt}
                          placeholder="blur"
                          // Data URL generated here: https://png-pixel.com/
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
                        />
                      ) : null}
                      <p>{post?.title}</p>
                    </a>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {author ? (
        <div className="bio" style={{ border: "1px solid black", padding: "10px" }}>
          <p>Biography</p>

          {author?.image ? (
            <div style={{ width: "200px" }}>
              <Image
                src={urlFor(author?.image).width(1240).height(540).url()}
                width={1240}
                height={540}
                sizes="(max-width: 800px) 100vw, 800px"
                layout="responsive"
                alt={author?.image?.alt}
                placeholder="blur"
                // Data URL generated here: https://png-pixel.com/
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
              />
            </div>
          ) : null}

          <p>{author?.name}</p>

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
      ) : null}
    </Layout>
  );
}

// See: https://nextjs.org/docs/basic-features/data-fetching
// See: https://youtu.be/f1rF9YKm1Ms

export async function getStaticProps() {
  const novel = await client.fetch(featuredNovelQuery);
  const reviews = await client.fetch(featuredReviewsQuery);
  const posts = await client.fetch(recentPostsQuery);
  const author = await client.fetch(authorBioQuery);

  return {
    props: {
      data: { novel, reviews, posts, author }
    }
  };
}
