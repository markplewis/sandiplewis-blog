import { usePreviewSubscription } from "lib/sanity";
import { client } from "lib/sanity.server";

import CategoryList from "components/CategoryList";
import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

import styles from "pages/styles/contentListing.module.css";

import { colors } from "utils/designTokens/colors";
import { rem } from "utils/units";

const query = `
  *[_type == "category"][] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }
`;

export default function Categories({ data: initialData }) {
  const { data: categories } = usePreviewSubscription(query, {
    initialData,
    enabled: true
  });

  return (
    <Layout title="Categories" description="Blog post categories">
      <style jsx global>
        {`
          body {
            --compBgColor: ${colors?.white?.hsl};
            --compFgColor: ${colors?.black?.hsl};
          }
        `}
      </style>

      <div className={styles.page}>
        <PageTitle>Post categories</PageTitle>

        <div className={styles.pageInner}>
          <div style={{ marginTop: rem(44), marginBottom: rem(44) }}>
            <CategoryList categories={categories} themed={true} centered={true} />
          </div>
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
