import ErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";

import { SITE_TITLE } from "lib/constants";
import { client } from "lib/sanity.server";
import { usePreviewSubscription } from "lib/sanity";

import Layout from "components/Layout";

import "pages/styles/author.module.css";

const query = `
  *[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    "image": image,
    "imageMeta": image.asset->{...},
    biography,
  }
`;

export default function Author({ data: initialData }) {
  const router = useRouter();

  const { data: author } = usePreviewSubscription(query, {
    params: {
      slug: initialData?.slug
    },
    initialData,
    enabled: true
  });

  return !router.isFallback && !author?.slug ? (
    <ErrorPage statusCode={404} />
  ) : (
    <Layout layoutClass="l-author">
      <Head>
        <title>
          {author?.name} | {SITE_TITLE}
        </title>
      </Head>
      <h2>{author?.name}</h2>
      <p>{author?.slug}</p>
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
    `*[_type == "author" && defined(slug.current)]{ "params": { "slug": slug.current } }`
  );
  return {
    paths,
    fallback: true
  };
}
