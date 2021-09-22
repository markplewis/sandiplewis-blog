import ErrorPage from "next/error";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { usePreviewSubscription, urlFor } from "lib/sanity";
import { client } from "lib/sanity.server";

import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

import commonStyles from "pages/styles/common.module.css";
// import "pages/styles/writing.module.css";

const novelsQuery = `
  *[_type == "novel"][] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    "image": image{..., ...asset->{creditLine, description, url}},
    description
  }
`;

const shortStoriesQuery = `
  *[_type == "shortStory"][] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    "image": image{..., ...asset->{creditLine, description, url}},
    description
  }
`;

export default function Writing({ data: initialData }) {
  const router = useRouter();

  const { data: novels } = usePreviewSubscription(novelsQuery, {
    initialData: initialData?.novels,
    enabled: true
  });
  const { data: shortStories } = usePreviewSubscription(shortStoriesQuery, {
    initialData: initialData?.shortStories,
    enabled: true
  });

  return !router.isFallback && !novels && !shortStories ? (
    <ErrorPage statusCode={404} />
  ) : (
    <Layout title="Writing" description="A listing of Sandi Plewis' novels and short stories">
      <div className={commonStyles.page}>
        <PageTitle>Writing</PageTitle>

        {novels.length ? <h2>Novels</h2> : null}

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
              <p>{novel.description}</p>
              <p>
                <Link as={`/novels/${novel?.slug}`} href="/novels/[slug]">
                  <a>Read more</a>
                </Link>
              </p>
            </div>
          );
        })}

        {shortStories.length ? <h2>Short stories</h2> : null}

        {shortStories.map(shortStory => {
          return (
            <div key={shortStory._id}>
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

              <h3>{shortStory.title}</h3>
              <p>{shortStory.description}</p>
              <p>
                <Link as={`/short-stories/${shortStory?.slug}`} href="/short-stories/[slug]">
                  <a>Read more</a>
                </Link>
              </p>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const novels = await client.fetch(novelsQuery);
  const shortStories = await client.fetch(shortStoriesQuery);
  return {
    props: {
      data: { novels, shortStories }
    }
  };
}
