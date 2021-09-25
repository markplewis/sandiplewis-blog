import ErrorPage from "next/error";
import { useRouter } from "next/router";

import { usePreviewSubscription } from "lib/sanity";
import { client } from "lib/sanity.server";

import Layout from "components/Layout";
import PageTitle from "components/PageTitle";
import PostList from "components/PostList";

import commonStyles from "pages/styles/common.module.css";
// import "pages/styles/post.module.css";

const query = `
  *[_type == "post"][] | order(publishedAt desc) {
    _id,
    title,
    "date": publishedAt,
    "slug": slug.current,
    "image": image{..., ...asset->{creditLine, description, "palette": metadata.palette, url}},
    description
  }
`;

export default function Posts({ data: initialData }) {
  const router = useRouter();

  const { data: posts } = usePreviewSubscription(query, {
    initialData,
    enabled: true
  });

  return !router.isFallback && !posts ? (
    <ErrorPage statusCode={404} />
  ) : (
    <Layout title="Posts" description="A listing of Sandi Plewis' blog posts">
      <div className={commonStyles.page}>
        <PageTitle>Posts</PageTitle>
        <PostList posts={posts} path="posts" size="large" />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const data = await client.fetch(query);
  return {
    props: {
      data
    }
  };
}
