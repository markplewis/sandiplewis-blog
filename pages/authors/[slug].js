import ErrorPage from "next/error";
import { useRouter } from "next/router";
import { client, usePreviewSubscription } from "lib/sanity";

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

export default function Author({ data: initialData, preview }) {
  const router = useRouter();

  const { data: author } = usePreviewSubscription(query, {
    params: {
      slug: initialData?.slug
    },
    initialData,
    enabled: preview
  });

  return !router.isFallback && !author?.slug ? (
    <ErrorPage statusCode={404} />
  ) : (
    <div>
      <h2>{author?.name}</h2>
      <p>{author?.slug}</p>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const data = await client.fetch(query, {
    slug: params.slug
  });
  return {
    props: {
      preview: true,
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
