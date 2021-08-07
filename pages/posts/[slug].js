import ErrorPage from "next/error";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { SITE_TITLE } from "lib/constants";
import { client, usePreviewSubscription } from "lib/sanity";

import PostBody from "components/post-body";
// // import MoreStories from "components/more-stories";
// // import Header from "components/header";
import PostHeader from "components/post-header";
import Comments from "components/comments";
import SectionSeparator from "components/section-separator";
import Layout from "components/layout";
import PostTitle from "components/post-title";
import Form from "components/form";

// This page uses a dynamic route. See: https://nextjs.org/docs/routing/dynamic-routes

const query = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    name,
    title,
    "date": publishedAt,
    "slug": slug.current,
    "image": image,
    "imageMeta": image.asset->{...},
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

export default function Post({ data: initialData, preview }) {
  const router = useRouter();

  // If we wanted to, we could use Next's cookie-based preview mode
  // instead or Sanity's live subscription-based preview feature:
  // https://nextjs.org/docs/advanced-features/preview-mode#fetch-preview-data

  // Documentation and references:
  // https://www.npmjs.com/package/next-sanity/v/0.1.4
  // https://www.sanity.io/blog/live-preview-with-nextjs

  const { data: post } = usePreviewSubscription(query, {
    params: {
      slug: initialData?.slug
    },
    initialData,
    enabled: preview
  });

  // console.log("category", post.category);
  // console.log("tags", post.tags);
  // console.log("test", post.test);

  return !router.isFallback && !post?.slug ? (
    <ErrorPage statusCode={404} />
  ) : (
    <Layout>
      {/* <Header /> */}
      {router.isFallback ? (
        <PostTitle>Loading…</PostTitle>
      ) : (
        <>
          <article>
            <Head>
              <title>
                {post.title} | {SITE_TITLE}
              </title>
              {/* <meta property="og:image" content={post.ogImage.url} /> */}
            </Head>

            <PostHeader
              title={post.title}
              image={post.image}
              imageMeta={post.imageMeta}
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

          <Comments comments={post.comments} />
          <Form _id={post._id} />

          <SectionSeparator />
          {/* {morePosts.length > 0 && <MoreStories posts={morePosts} />} */}
        </>
      )}
    </Layout>
  );
}

// See: https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation

export async function getStaticProps({ params }) {
  const data = await client.fetch(query, {
    slug: params.slug
  });
  return {
    props: {
      preview: true,
      data
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
