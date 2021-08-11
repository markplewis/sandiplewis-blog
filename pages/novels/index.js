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

import "pages/styles/novel.module.css";

const query = `
  *[_type == "novel"][] {
    _id,
    title,
    "slug": slug.current,
    "image": image{..., ...asset->{creditLine, description, url}},
    overview
  }
`;

export default function Novels({ data: initialData }) {
  const router = useRouter();

  const { data: novels } = usePreviewSubscription(query, {
    initialData,
    enabled: true
  });

  return !router.isFallback && !novels ? (
    <ErrorPage statusCode={404} />
  ) : (
    <Layout layoutClass="l-novel">
      <Head>
        <title>Novels | {SITE_TITLE}</title>
      </Head>
      <h2>Novels</h2>

      {novels.map(novel => {
        return (
          <div key={novel._id}>
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

            <h3>{novel.title}</h3>

            {novel.overview && (
              <BlockContent
                blocks={novel.overview}
                projectId={config.projectId}
                dataset={config.dataset}
              />
            )}
            <p>
              <Link as={`/novels/${novel?.slug}`} href="/novels/[slug]">
                <a>Read more</a>
              </Link>
            </p>
          </div>
        );
      })}
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
