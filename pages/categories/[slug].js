import ErrorPage from "next/error";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { SITE_TITLE } from "lib/constants";
import { client } from "lib/sanity.server";

import Layout from "components/Layout";

import "pages/styles/category.module.css";

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
    <Layout layoutClass="l-category">
      <Head>
        <title>
          {category?.title} | {SITE_TITLE}
        </title>
      </Head>

      <h2>{category?.title}</h2>
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
