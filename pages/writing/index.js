import ErrorPage from "next/error";
import { useRouter } from "next/router";

import { usePreviewSubscription } from "lib/sanity";
import { client } from "lib/sanity.server";

import Layout from "components/Layout";
import PageTitle from "components/PageTitle";
import PostList from "components/PostList";

import commonStyles from "pages/styles/common.module.css";
// import "pages/styles/writing.module.css";

const novelsQuery = `
  *[_type == "novel"][] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    "image": image{..., ...asset->{creditLine, description, url}},
    description
  }
`;

const shortStoriesQuery = `
  *[_type == "shortStory"][] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    "image": image{..., ...asset->{creditLine, description, url}},
    description
  }
`;

export default function Writing({ data: initialData }) {
  const router = useRouter();

  const { data: novels } = usePreviewSubscription(novelsQuery, {
    initialData: initialData?.novels,
    enabled: true
  });
  const { data: shortStories } = usePreviewSubscription(shortStoriesQuery, {
    initialData: initialData?.shortStories,
    enabled: true
  });

  return !router.isFallback && !novels && !shortStories ? (
    <ErrorPage statusCode={404} />
  ) : (
    <Layout title="Writing" description="A listing of Sandi Plewis' novels and short stories">
      <div className={commonStyles.page}>
        <PageTitle>Writing</PageTitle>

        {novels.length ? (
          <>
            <h2>Novels</h2>
            <PostList posts={novels} path="novels" size="large" orientation="portrait" />
          </>
        ) : null}

        {shortStories.length ? (
          <>
            <h2>Short stories</h2>
            <PostList
              posts={shortStories}
              path="short-stories"
              size="large"
              orientation="portrait"
            />
          </>
        ) : null}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const novels = await client.fetch(novelsQuery);
  const shortStories = await client.fetch(shortStoriesQuery);
  return {
    props: {
      data: { novels, shortStories }
    }
  };
}
