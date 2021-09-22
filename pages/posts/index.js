import ErrorPage from "next/error";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { usePreviewSubscription, urlFor } from "lib/sanity";
import { client } from "lib/sanity.server";

import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

import commonStyles from "pages/styles/common.module.css";
// import "pages/styles/post.module.css";

const query = `
  *[_type == "post"][] | order(publishedAt desc) {
    _id,
    title,
    "date": publishedAt,
    "slug": slug.current,
    "image": image{..., ...asset->{creditLine, description, "palette": metadata.palette, url}},
    description
  }
`;

export default function Posts({ data: initialData }) {
  const router = useRouter();

  const { data: posts } = usePreviewSubscription(query, {
    initialData,
    enabled: true
  });

  return !router.isFallback && !posts ? (
    <ErrorPage statusCode={404} />
  ) : (
    <Layout title="Posts" description="A listing of Sandi Plewis' blog posts">
      <div className={commonStyles.page}>
        <PageTitle>Posts</PageTitle>

        {posts.map(post => {
          return (
            <div key={post._id}>
              {post?.image ? (
                <div style={{ width: "188px" }}>
                  <Image
                    src={urlFor(post?.image).width(376).height(600).url()}
                    width={188}
                    height={300}
                    sizes="188px"
                    layout="responsive"
                    alt={post.image.alt || post.title}
                    placeholder="blur"
                    // Data URL generated here: https://png-pixel.com/
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
                  />
                </div>
              ) : null}

              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <p>
                <Link as={`/posts/${post?.slug}`} href="/posts/[slug]">
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
  const data = await client.fetch(query);
  return {
    props: {
      data
    }
  };
}
