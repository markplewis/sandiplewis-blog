import BlockContent from "@sanity/block-content-to-react";

import ErrorPage from "next/error";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import config from "lib/config";
import { SITE_TITLE } from "lib/constants";
import { client } from "lib/sanity.server";
import { usePreviewSubscription, urlFor } from "lib/sanity";

import Layout from "components/Layout";
import PageTitle from "components/PageTitle";
import PostBodyImage from "components/serializers/PostBodyImage";

import commonStyles from "pages/styles/common.module.css";
// import "pages/styles/author.module.css";

const query = `
  *[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    "image": image{..., ...asset->{creditLine, description, url}},
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

  const serializers = {
    types: {
      // eslint-disable-next-line react/display-name
      image: ({ node }) => <PostBodyImage node={node} />
    }
  };

  return !router.isFallback && !author?.slug ? (
    <ErrorPage statusCode={404} />
  ) : (
    <Layout>
      <Head>
        <title>
          {author?.name} | {SITE_TITLE}
        </title>
      </Head>

      <div className={commonStyles.page}>
        {author?.image ? (
          <div style={{ width: "188px" }}>
            <Image
              src={urlFor(author.image.asset).width(376).height(600).url()}
              width={188}
              height={300}
              sizes="188px"
              layout="responsive"
              alt={author.image.alt || author.name}
              placeholder="blur"
              // Data URL generated here: https://png-pixel.com/
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
            />
          </div>
        ) : null}

        <PageTitle>{author?.name}</PageTitle>

        {author?.biography && (
          <BlockContent
            blocks={author.biography}
            serializers={serializers}
            projectId={config.projectId}
            dataset={config.dataset}
          />
        )}
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
    `*[_type == "author" && defined(slug.current)]{ "params": { "slug": slug.current } }`
  );
  return {
    paths,
    fallback: true
  };
}
