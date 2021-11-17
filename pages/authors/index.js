import { usePreviewSubscription } from "lib/sanity";
import { client } from "lib/sanity.server";

import Layout from "components/Layout";
import PageTitle from "components/PageTitle";
import PostList from "components/PostList";

import styles from "pages/styles/contentListing.module.css";

const query = `
  *[_type == "author"][] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    "image": image{..., ...asset->{creditLine, description, url}},
    description
  }
`;

export default function Authors({ data: initialData }) {
  const { data: authors } = usePreviewSubscription(query, {
    initialData,
    enabled: true
  });

  return (
    <Layout title="Authors" description="Authors">
      <div className={styles.page}>
        <PageTitle>Authors</PageTitle>

        <div className={styles.pageInner}>
          <PostList
            posts={authors}
            path="authors"
            size="large"
            orientation="square"
            showBackground={true}
          />
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const data = await client.fetch(query);
  return {
    props: {
      data
    },
    revalidate: 10
  };
}
