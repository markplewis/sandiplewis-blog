import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "components/container";
import PostBody from "components/post-body";
import MoreStories from "components/more-stories";
import Header from "components/header";
import PostHeader from "components/post-header";
import Comments from "components/comments";
import SectionSeparator from "components/section-separator";
import Layout from "components/layout";
import { getAllPostsWithSlug, getPostAndMorePosts } from "lib/api";
import PostTitle from "components/post-title";
import Head from "next/head";
import { SITE_TITLE } from "lib/constants";
import Form from "components/form";

// This page uses a dynamic route. See: https://nextjs.org/docs/routing/dynamic-routes

export default function Post({ post, morePosts, preview }) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout preview={preview}>
      <Container>
        <Header />
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
                coverImage={post.coverImage}
                coverImageMeta={post.coverImageMeta}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.body} />
            </article>

            <Comments comments={post.comments} />
            <Form _id={post._id} />

            <SectionSeparator />
            {morePosts.length > 0 && <MoreStories posts={morePosts} />}
          </>
        )}
      </Container>
    </Layout>
  );
}

// See: https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation

export async function getStaticProps({ params, preview = false }) {
  // If context.preview is true, append "/preview" to the API endpoint
  // to request draft data instead of published data. This will vary
  // based on which headless CMS you're using.
  // See: https://nextjs.org/docs/advanced-features/preview-mode#fetch-preview-data

  const data = await getPostAndMorePosts(params.slug, preview);
  return {
    props: {
      preview,
      post: data?.post || null,
      morePosts: data?.morePosts || null
    },
    revalidate: 1
  };
}

// See: https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation

export async function getStaticPaths() {
  const allPosts = await getAllPostsWithSlug();
  return {
    paths:
      allPosts?.map(post => ({
        params: {
          slug: post.slug
        }
      })) || [],
    // See: https://nextjs.org/docs/basic-features/data-fetching#the-fallback-key-required
    fallback: true
  };
}
