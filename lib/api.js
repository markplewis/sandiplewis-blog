import { getClient, client } from "lib/sanity.server";

// Sanity API queries (server-side)

const getUniquePosts = posts => {
  const slugs = new Set();
  return posts.filter(post => {
    if (slugs.has(post.slug)) {
      return false;
    } else {
      slugs.add(post.slug);
      return true;
    }
  });
};

const postFields = `
  _id,
  name,
  title,
  'date': publishedAt,
  excerpt,
  'slug': slug.current,
  'coverImage': mainImage,
  'coverImageMeta': mainImage.asset->{...},
  'author': author->{name, 'picture': image.asset->url},
`;

export async function getPreviewPostBySlug(slug) {
  const data = await getClient(true).fetch(
    // TODO: what's wrong with this complete version of the query?
    // `*[_type == "post" && slug.current == $slug] | order(publishedAt desc){
    //   ${postFields}
    //   body
    // }`,
    // We only need to fetch the slug in order to verify that a post with the provided slug exists.
    // We could fetch all of the post's data, but that's unnecessary and is throwing errors.
    `*[_type == "post" && slug.current == $slug] | order(publishedAt desc){
      title,
      'slug': slug.current
    }`,
    { slug }
  );
  return data[0];
}

export async function getAllPostsWithSlug() {
  const data = await client.fetch(`*[_type == "post"]{ 'slug': slug.current }`);
  return data;
}

export async function getAllPostsForHome(preview) {
  const results = await getClient(preview).fetch(`*[_type == "post"] | order(publishedAt desc){
      ${postFields}
    }`);
  return getUniquePosts(results);
}

export async function getPostAndMorePosts(slug, preview) {
  const curClient = getClient(preview);
  const [post, morePosts] = await Promise.all([
    curClient
      .fetch(
        `*[_type == "post" && slug.current == $slug] | order(_updatedAt desc) {
        ${postFields}
        body,
        'comments': *[
          _type == "comment" &&
          post._ref == ^._id &&
          approved == true
        ] {
          _id,
          name,
          email,
          comment,
          _createdAt
        }
      }`,
        { slug }
      )
      .then(res => res?.[0]),
    curClient.fetch(
      `*[_type == "post" && slug.current != $slug] | order(publishedAt desc, _updatedAt desc) {
        ${postFields}
        body,
      }[0...2]`,
      { slug }
    )
  ]);
  return { post, morePosts: getUniquePosts(morePosts) };
}
