import ErrorPage from "next/error";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { SITE_TITLE } from "lib/constants";
import { client } from "lib/sanity.server";

import Layout from "components/Layout";
import MoreLink from "components/MoreLink";
import PageTitle from "components/PageTitle";

import commonStyles from "pages/styles/common.module.css";
// import "pages/styles/category.module.css";

// Get posts in this category
// See: https://css-tricks.com/how-to-make-taxonomy-pages-with-gatsby-and-sanity-io/#querying-sanitys-references
// TODO: paginate posts
const query = `
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    "posts": *[_type == "post" && references(^._id)]{
      title,
      "slug": slug.current
    }
  }
`;

export default function Category({ data: category }) {
  const router = useRouter();

  return !router.isFallback && !category?.slug ? (
    <ErrorPage statusCode={404} />
  ) : (
    <Layout description={category?.description ?? `Blog posts in category: ${category?.title}`}>
      <Head>
        <title>
          Category: {category?.title} | {SITE_TITLE}
        </title>
      </Head>

      <div className={commonStyles.page}>
        <PageTitle>{category?.title}</PageTitle>
        <p>{category?.description}</p>

        {category?.posts ? (
          <>
            <p>Posts:</p>
            <ul>
              {category.posts.map(({ slug, title }) => (
                <li key={slug}>
                  <Link as={`/posts/${slug}`} href="/posts/[slug]">
                    <a>{title}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <p>
          <MoreLink as="/categories" href="/categories" text="More categories" align="start" />
        </p>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const data = await client.fetch(query, {
    slug: params.slug
  });
  return {
    props: {
      data
    }
  };
}

export async function getStaticPaths() {
  const paths = await client.fetch(
    `*[_type == "category" && defined(slug.current)]{ "params": { "slug": slug.current } }`
  );
  return {
    paths,
    fallback: true
  };
}
