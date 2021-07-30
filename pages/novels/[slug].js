import ErrorPage from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";
import { client, usePreviewSubscription } from "lib/sanity";

const query = `
  *[_type == "novel" && slug.current == $slug][0] {
    _id,
    name,
    title,
    "slug": slug.current,
    "author": author->{name, "slug": slug.current, "picture": image.asset->url},
    "image": image,
    overview,
    synopsis
  }
`;

export default function Novel({ data: initialData, preview }) {
  const router = useRouter();

  const { data: novel } = usePreviewSubscription(query, {
    params: {
      slug: initialData?.slug
    },
    initialData,
    enabled: preview
  });

  return !router.isFallback && !novel?.slug ? (
    <ErrorPage statusCode={404} />
  ) : (
    <div>
      <h2>{novel?.title}</h2>
      <p>
        <Link as={`/authors/${novel?.author?.slug}`} href="/authors/[slug]">
          <a>{novel?.author?.name}</a>
        </Link>
      </p>
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
    `*[_type == "novel" && defined(slug.current)]{ "params": { "slug": slug.current } }`
  );
  return {
    paths,
    fallback: true
  };
}
