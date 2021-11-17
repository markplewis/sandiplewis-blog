import { usePreviewSubscription } from "lib/sanity";
import { client } from "lib/sanity.server";

import Layout from "components/Layout";
import PageTitle from "components/PageTitle";
import PostList from "components/PostList";

import styles from "pages/styles/contentListing.module.css";

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
  const { data: posts } = usePreviewSubscription(query, {
    initialData,
    enabled: true
  });

  return (
    <Layout title="Blog posts" description="A listing of Sandi Plewis' blog posts">
      <div className={styles.page}>
        <PageTitle>Blog posts</PageTitle>

        {/* TODO: implement sort filters and search box */}

        <div className={styles.pageInner}>
          <PostList
            posts={posts}
            path="posts"
            size="large"
            orientation="portrait"
            showDates={true}
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
