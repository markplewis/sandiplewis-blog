import Container from "components/container";
import MoreStories from "components/more-stories";
import HeroPost from "components/hero-post";
import Intro from "components/intro";
import Layout from "components/layout";
import { getAllPostsForHome } from "lib/api";
import Head from "next/head";
import Image from "next/image";
import { SITE_TITLE } from "lib/constants";

export default function Index({ allPosts, preview }) {
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);
  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>{SITE_TITLE}</title>
        </Head>
        <Container>
          <Intro />
          <Image src="/images/sandi-plewis.jpg" width={200} height={300} alt="Sandi Plewis" />
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              coverImageMeta={heroPost.coverImageMeta}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
      </Layout>
    </>
  );
}

// See: https://nextjs.org/docs/basic-features/data-fetching
// See: https://youtu.be/f1rF9YKm1Ms

export async function getStaticProps({ preview = false }) {
  const allPosts = await getAllPostsForHome(preview);
  return {
    props: { allPosts, preview },
    revalidate: 1
  };
}
