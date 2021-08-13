import ErrorPage from "next/error";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { SITE_TITLE } from "lib/constants";
import { usePreviewSubscription } from "lib/sanity";
import { client } from "lib/sanity.server";

import Layout from "components/Layout";

import "pages/styles/category.module.css";

const query = `
  *[_type == "category"][] {
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
    <Layout layoutClass="l-category">
      <Head>
        <title>Categories | {SITE_TITLE}</title>
      </Head>
      <h2>Categories</h2>
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