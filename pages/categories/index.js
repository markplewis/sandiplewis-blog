import ErrorPage from "next/error";
import { useRouter } from "next/router";

import { usePreviewSubscription } from "lib/sanity";
import { client } from "lib/sanity.server";

import CategoryList from "components/CategoryList";
import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

import commonStyles from "pages/styles/common.module.css";
import styles from "pages/styles/writingAndPosts.module.css";
import { rem } from "utils/units";

const query = `
  *[_type == "category"][] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }
`;

export default function Categories({ data: initialData }) {
  const router = useRouter();

  const { data: categories } = usePreviewSubscription(query, {
    initialData,
    enabled: true
  });

  return !router.isFallback && !categories ? (
    <ErrorPage statusCode={404} />
  ) : (
    <Layout title="Categories" description="Blog post categories">
      <style jsx global>
        {`
          body {
            --compBgColor: #fff;
            --compFgColor: #333;
          }
        `}
      </style>

      <div className={`${commonStyles.page} ${styles.page}`}>
        <PageTitle>Blog post categories</PageTitle>

        <div className={styles.pageInner}>
          <div style={{ marginTop: rem(44), marginBottom: rem(44) }}>
            <CategoryList categories={categories} themed={true} />
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
    }
  };
}
