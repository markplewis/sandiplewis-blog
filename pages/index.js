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
import config from "lib/config";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { SITE_TITLE } from "lib/constants";

import BlockContent from "@sanity/block-content-to-react";
import { imageBuilder } from "lib/sanity";

export default function Index({
  // allPosts,
  novel,
  reviews,
  posts,
  author,
  preview
}) {
  // const heroPost = allPosts[0];
  // const morePosts = allPosts.slice(1);
  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>{SITE_TITLE}</title>
        </Head>
        <Container>
          <h2>Home page</h2>
          <div className="novel" style={{ border: "1px solid black", padding: "10px" }}>
            {novel?.image ? (
              <Link as={`/novels/${novel?.slug}`} href="/novels/[slug]">
                <a>
                  <Image
                    src={imageBuilder(novel?.image).width(1240).height(540).url()}
                    width={1240}
                    height={540}
                    sizes="(max-width: 800px) 100vw, 800px"
                    layout="responsive"
                    alt={novel?.image?.alt}
                    placeholder="blur"
                    // Data URL generated here: https://png-pixel.com/
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
                  />
                </a>
              </Link>
            ) : null}
            <p>{novel?.title}</p>
            <BlockContent
              blocks={novel?.overview}
              projectId={config.projectId}
              dataset={config.dataset}
            />
            <Link as={`/novels/${novel?.slug}`} href="/novels/[slug]">
              <a>More</a>
            </Link>
          </div>

          <div className="reviews" style={{ border: "1px solid black", padding: "10px" }}>
            <p>Reviews</p>
            <ul>
              {reviews &&
                reviews.map(review => (
                  <li key={review?._id}>
                    <p>{review?.title}</p>
                    <p>{review?.review}</p>
                    <p>- {review?.author}</p>
                  </li>
                ))}
            </ul>
          </div>

          <div className="posts" style={{ border: "1px solid black", padding: "10px" }}>
            <p>Recent posts</p>
            <ul>
              {posts &&
                posts.map(post => (
                  <li key={post?._id}>
                    <Link as={`/posts/${post?.slug}`} href="/posts/[slug]">
                      <a>
                        {post?.image ? (
                          <Image
                            src={imageBuilder(post?.image).width(1240).height(540).url()}
                            width={1240}
                            height={540}
                            sizes="(max-width: 800px) 100vw, 800px"
                            layout="responsive"
                            alt={post?.image?.alt}
                            placeholder="blur"
                            // Data URL generated here: https://png-pixel.com/
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
                          />
                        ) : null}
                        <p>{post?.title}</p>
                      </a>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div className="bio" style={{ border: "1px solid black", padding: "10px" }}>
            <p>Biography</p>
            {author?.image ? (
              <Image
                src={imageBuilder(author?.image).width(1240).height(540).url()}
                width={1240}
                height={540}
                sizes="(max-width: 800px) 100vw, 800px"
                layout="responsive"
                alt={author?.image?.alt}
                placeholder="blur"
                // Data URL generated here: https://png-pixel.com/
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
              />
            ) : null}
            <p>{author?.name}</p>
            <BlockContent
              blocks={author?.biography}
              projectId={config.projectId}
              dataset={config.dataset}
            />
            <Link as={`/authors/${author?.slug}`} href="/authors/[slug]">
              <a>More</a>
            </Link>
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
  const novel = await getFeaturedNovel(preview);
  const reviews = await getFeaturedReviews(preview);
  const posts = await getRecentPosts(preview, 4);
  const author = await getAuthorBio(preview);
  // const allPosts = await getAllPostsForHome(preview);
  return {
    props: { novel, reviews, posts, author, preview },
    revalidate: 1
  };
}
