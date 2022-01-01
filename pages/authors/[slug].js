import { usePreviewSubscription } from "lib/sanity";
import { client } from "lib/sanity.server";

import CoverImage from "components/CoverImage";
import Layout from "components/Layout";
import PageTitle from "components/PageTitle";
import PostBody from "components/PostBody";

import { getPageColors } from "utils/color";

import styles from "pages/styles/author.module.css";

const query = `
  *[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
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
    "biography": biography[] {
      ...,
      _type == "image" => {
        ...,
        "asset": asset->
      },
      markDefs[]{
        ...,
        _type == "internalLink" => {
          "type": @.reference->_type,
          "slug": @.reference->slug
        }
      }
    },
    description
  }
`;

export default function Author({ data: initialData }) {
  const { data: author } = usePreviewSubscription(query, {
    params: {
      slug: initialData?.slug
    },
    initialData,
    enabled: true
  });

  const pageColors = getPageColors(author);

  return (
    <Layout
      title={author?.name}
      description={author?.description}
      image={{ image: author?.image, portrait: true, crop: true }}>
      <style jsx global>
        {`
          body {
            ${pageColors.css}
          }
        `}
      </style>

      <div className={styles.heroArea}>
        <div className={styles.patternBlock}>
          <div
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='${pageColors?.primaryBgLow?.replace(
                "#",
                "%23"
              )}' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
            }}></div>
        </div>

        <div className={styles.coverImageAndTitle}>
          <CoverImage
            className={styles.coverImage}
            image={author?.image}
            title={author?.name}
            width={376}
            height={376}
          />
          <PageTitle className={styles.title}>{author?.name}</PageTitle>
        </div>
      </div>

      <div className={styles.bodyArea}>
        {author?.biography && <PostBody content={author.biography} />}
      </div>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const data = await client.fetch(query, {
    slug: params.slug
  });
  if (!data) {
    return {
      notFound: true
    };
  }
  return {
    props: {
      data
    },
    revalidate: 10
  };
}

export async function getStaticPaths() {
  const paths = await client.fetch(
    `*[_type == "author" && defined(slug.current)]{ "params": { "slug": slug.current } }`
  );
  return {
    paths,
    fallback: "blocking"
  };
}
