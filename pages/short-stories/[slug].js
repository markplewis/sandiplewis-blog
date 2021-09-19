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
// import "pages/styles/shortStory.module.css";

const query = `
  *[_type == "shortStory" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    "author": author->{name, "slug": slug.current, "picture": image.asset->url},
    "image": image{..., ...asset->{creditLine, description, url}},
    generalInfo,
    description
  }
`;

export default function ShortStory({ data: initialData }) {
  const router = useRouter();

  const { data: shortStory } = usePreviewSubscription(query, {
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

  return !router.isFallback && !shortStory?.slug ? (
    <ErrorPage statusCode={404} />
  ) : (
    <Layout description={shortStory?.description}>
      <Head>
        <title>
          {shortStory?.title} | {SITE_TITLE}
        </title>
      </Head>

      <div className={commonStyles.page}>
        {shortStory?.image ? (
          <div style={{ width: "188px" }}>
            <Image
              src={urlFor(shortStory.image.asset).width(376).height(600).url()}
              width={188}
              height={300}
              sizes="188px"
              layout="responsive"
              alt={shortStory.image.alt || shortStory.title}
              placeholder="blur"
              // Data URL generated here: https://png-pixel.com/
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
            />
          </div>
        ) : null}

        <PageTitle>{shortStory?.title}</PageTitle>

        {shortStory?.generalInfo && (
          <BlockContent
            blocks={shortStory.generalInfo}
            serializers={serializers}
            projectId={config.projectId}
            dataset={config.dataset}
          />
        )}
        <p>
          By{" "}
          <Link as={`/authors/${shortStory?.author?.slug}`} href="/authors/[slug]">
            <a>{shortStory?.author?.name}</a>
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
    `*[_type == "shortStory" && defined(slug.current)]{ "params": { "slug": slug.current } }`
  );
  return {
    paths,
    fallback: true
  };
}
