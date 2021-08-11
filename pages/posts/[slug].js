import ErrorPage from "next/error";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { SITE_TITLE } from "lib/constants";
import { usePreviewSubscription } from "lib/sanity";
import { client } from "lib/sanity.server";

import PostBody from "components/PostBody";
import PostHeader from "components/PostHeader";
import Comments from "components/Comments";
import CommentForm from "components/CommentForm";
import Layout from "components/Layout";
import PostTitle from "components/PostTitle";

import "pages/styles/post.module.css";

// This page uses a dynamic route. See: https://nextjs.org/docs/routing/dynamic-routes

const commentsEnabledQuery = `*[_type == "settings"][0].commentsEnabled`;

const postQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "date": publishedAt,
    "slug": slug.current,
    "image": image{..., ...asset->{creditLine, description, "palette": metadata.palette, url}},
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

  return !router.isFallback && !post?.slug ? (
    <ErrorPage statusCode={404} />
  ) : (
    // TODO: pass page meta description, keywords, etc. to <Layout>
    <Layout layoutClass="l-post">
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

          <article>
            <PostHeader
              title={post.title}
              image={post.image}
              date={post.date}
              author={post.author}
            />

            {post.categories && post.categories.length ? (
              <>
                <p>Categories</p>
                <ul>
                  {post.categories.map(({ slug, title }) => (
                    <li key={slug}>
                      <Link as={`/categories/${slug}`} href="/categories/[slug]">
                        <a>{title}</a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {post.tags && post.tags.length ? (
              <p>Tags: {post.tags.map(tag => tag.label).join(", ")}</p>
            ) : null}

            <PostBody content={post.body} />
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
