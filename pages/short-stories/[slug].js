import BlockContent from "@sanity/block-content-to-react";

import ErrorPage from "next/error";
import Image from "next/image";
import { useRouter } from "next/router";

import config from "lib/config";
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
    colorPalette,
    primaryColor,
    secondaryColor,
    "image": image{..., ...asset->{
      creditLine,
      description,
      "palette": metadata.palette,
      url
    }},
    overview,
    body,
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
    <Layout
      title={shortStory?.title}
      description={shortStory?.description}
      image={{ image: shortStory?.image, portrait: true, crop: false }}>
      <div className={commonStyles.page}>
        {shortStory?.image ? (
          <div style={{ width: "188px" }}>
            <Image
              src={urlFor(shortStory?.image).width(376).height(600).url()}
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

        {shortStory?.overview && (
          <BlockContent
            blocks={shortStory.overview}
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
    `*[_type == "shortStory" && defined(slug.current)]{ "params": { "slug": slug.current } }`
  );
  return {
    paths,
    fallback: true
  };
}
