import BlockContent from "@sanity/block-content-to-react";

import ErrorPage from "next/error";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import config from "lib/config";
import { SITE_TITLE } from "lib/constants";
import { usePreviewSubscription, urlFor } from "lib/sanity";
import { client } from "lib/sanity.server";

import Layout from "components/Layout";
import PageTitle from "components/PageTitle";
import PostBodyImage from "components/serializers/PostBodyImage";

import commonStyles from "pages/styles/common.module.css";
// import "pages/styles/novel.module.css";

const query = `
  *[_type == "novel" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    "author": author->{name, "slug": slug.current, "picture": image.asset->url},
    "image": image{..., ...asset->{creditLine, description, url}},
    synopsis,
    description
  }
`;

export default function Novel({ data: initialData }) {
  const router = useRouter();

  const { data: novel } = usePreviewSubscription(query, {
    params: {
      slug: initialData?.slug
    },
    initialData,
    enabled: true
  });

  const serializers = {
    types: {
      // eslint-disable-next-line react/display-name
      image: ({ node }) => <PostBodyImage node={node} />
    }
  };

  return !router.isFallback && !novel?.slug ? (
    <ErrorPage statusCode={404} />
  ) : (
    <Layout description={novel?.description}>
      <Head>
        <title>
          {novel?.title} | {SITE_TITLE}
        </title>
      </Head>

      <div className={commonStyles.page}>
        {novel?.image ? (
          <div style={{ width: "188px" }}>
            <Image
              src={urlFor(novel.image.asset).width(376).height(600).url()}
              width={188}
              height={300}
              sizes="188px"
              layout="responsive"
              alt={novel.image.alt || novel.title}
              placeholder="blur"
              // Data URL generated here: https://png-pixel.com/
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
            />
          </div>
        ) : null}

        <PageTitle>{novel?.title}</PageTitle>

        {novel?.synopsis && (
          <BlockContent
            blocks={novel.synopsis}
            serializers={serializers}
            projectId={config.projectId}
            dataset={config.dataset}
          />
        )}
        <p>
          By{" "}
          <Link as={`/authors/${novel?.author?.slug}`} href="/authors/[slug]">
            <a>{novel?.author?.name}</a>
          </Link>
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
    `*[_type == "novel" && defined(slug.current)]{ "params": { "slug": slug.current } }`
  );
  return {
    paths,
    fallback: true
  };
}
