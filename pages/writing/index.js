import { usePreviewSubscription } from "lib/sanity";
import { client } from "lib/sanity.server";

import Layout from "components/Layout";
import PageTitle from "components/PageTitle";
import PostList from "components/PostList";

import styles from "pages/styles/contentListing.module.css";

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
  const { data: novels } = usePreviewSubscription(novelsQuery, {
    initialData: initialData?.novels,
    enabled: true
  });
  const { data: shortStories } = usePreviewSubscription(shortStoriesQuery, {
    initialData: initialData?.shortStories,
    enabled: true
  });

  return (
    <Layout title="Writing" description="A listing of Sandi Plewis' novels and short stories">
      <div className={styles.page}>
        <PageTitle>Writing</PageTitle>

        <div className={styles.pageInner}>
          {novels.length ? (
            <div className={styles.novels}>
              <h2 className={styles.subHeading}>Novels</h2>
              <PostList
                posts={novels}
                path="novels"
                size="large"
                orientation="portrait"
                showBackground={true}
              />
            </div>
          ) : null}

          {shortStories.length ? (
            <div className={styles.posts}>
              <h2 className={styles.subHeading}>Short stories</h2>
              <PostList
                posts={shortStories}
                path="short-stories"
                size="large"
                orientation="portrait"
                showBackground={true}
              />
            </div>
          ) : null}
        </div>
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
    },
    revalidate: 10
  };
}
