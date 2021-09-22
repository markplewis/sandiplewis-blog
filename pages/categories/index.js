import ErrorPage from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";

import { usePreviewSubscription } from "lib/sanity";
import { client } from "lib/sanity.server";

import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

import commonStyles from "pages/styles/common.module.css";
// import "pages/styles/category.module.css";

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
      <div className={commonStyles.page}>
        <PageTitle>Categories</PageTitle>
        <ul>
          {categories.map(category => {
            return (
              <li key={category._id}>
                <Link as={`/categories/${category?.slug}`} href="/categories/[slug]">
                  <a>{category.title}</a>
                </Link>
              </li>
            );
          })}
        </ul>
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
