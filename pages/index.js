import Container from "components/container";
// import MoreStories from "components/more-stories";
// import HeroPost from "components/hero-post";
// import Intro from "components/intro";
import Layout from "components/layout";
import {
  // getAllPostsForHome,
  getAuthorBio,
  getFeaturedNovel,
  getFeaturedReviews,
  getRecentPosts
} from "lib/api";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { SITE_TITLE } from "lib/constants";

import BlockContent from "@sanity/block-content-to-react";
import { imageBuilder } from "lib/sanity";

export default function Index({
  // allPosts,
  featuredNovel,
  featuredReviews,
  authorBio,
  recentPosts,
  preview
}) {
  // const heroPost = allPosts[0];
  // const morePosts = allPosts.slice(1);

  const novelImage = featuredNovel.images[0];
  const authorImage = authorBio.image;
  console.log(recentPosts);

  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>{SITE_TITLE}</title>
        </Head>
        <Container>
          <div className="novel" style={{ border: "1px solid black", padding: "10px" }}>
            <Link as={`/novels/${featuredNovel.slug.current}`} href="/novels/[slug]">
              <a>{featuredNovel.title}</a>
            </Link>
            <Image
              src={imageBuilder(novelImage).width(1240).height(540).url()}
              width={1240}
              height={540}
              sizes="(max-width: 800px) 100vw, 800px"
              layout="responsive"
              alt={novelImage.alt}
              placeholder="blur"
              // Data URL generated here: https://png-pixel.com/
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
            />
            <BlockContent
              blocks={featuredNovel.overview}
              projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
              dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            />
          </div>

          <div className="reviews" style={{ border: "1px solid black", padding: "10px" }}>
            <p>Reviews</p>
            <ul>
              {featuredReviews.map(review => (
                <li key={review._id}>
                  <p>{review.title}</p>
                  <p>{review.review}</p>
                  <p>- {review.reviewer}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bio" style={{ border: "1px solid black", padding: "10px" }}>
            <p>{authorBio.name}</p>
            <Image
              src={imageBuilder(authorImage).width(1240).height(540).url()}
              width={1240}
              height={540}
              sizes="(max-width: 800px) 100vw, 800px"
              layout="responsive"
              alt={authorImage.alt}
              placeholder="blur"
              // Data URL generated here: https://png-pixel.com/
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
            />
            <BlockContent
              blocks={authorBio.biography}
              projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
              dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            />
          </div>

          <div className="posts" style={{ border: "1px solid black", padding: "10px" }}>
            <p>Recent posts</p>
            <ul>
              {recentPosts.map(post => (
                <li key={post._id}>
                  <Link as={`/posts/${post.slug.current}`} href="/posts/[slug]">
                    <a>
                      <p>{post.title}</p>
                      <Image
                        src={imageBuilder(post.mainImage).width(1240).height(540).url()}
                        width={1240}
                        height={540}
                        sizes="(max-width: 800px) 100vw, 800px"
                        layout="responsive"
                        alt={post.mainImage.alt}
                        placeholder="blur"
                        // Data URL generated here: https://png-pixel.com/
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
                      />
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Old stuff */}
          {/* <Intro />
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
          {morePosts.length > 0 && <MoreStories posts={morePosts} />} */}
        </Container>
      </Layout>
    </>
  );
}

// See: https://nextjs.org/docs/basic-features/data-fetching
// See: https://youtu.be/f1rF9YKm1Ms

export async function getStaticProps({ preview = false }) {
  const featuredNovel = await getFeaturedNovel(preview);
  const featuredReviews = await getFeaturedReviews(preview);
  const authorBio = await getAuthorBio(preview);
  const recentPosts = await getRecentPosts(preview, 4);
  // const allPosts = await getAllPostsForHome(preview);
  return {
    props: { featuredNovel, featuredReviews, authorBio, recentPosts, preview },
    revalidate: 1
  };
}
