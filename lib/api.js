import { client } from "lib/sanity";

// Sanity API queries (server-side)

// ------------------------------------- //
// Home page
// ------------------------------------- //

export async function getFeaturedNovel() {
  return await client.fetch(
    `*[_type == "homePage"][0].novel->{title, 'slug': slug.current, overview, image, _id}`
  );
}

export async function getFeaturedReviews() {
  return await client.fetch(`*[_type == "homePage"][0].reviews[]->{review, author, title, _id}`);
}

export async function getRecentPosts(limit) {
  return await client.fetch(
    `*[_type == "post"][0..${
      limit - 1
    }] | order(publishedAt desc){title, 'slug': slug.current, image, _id}`
  );
}

export async function getAuthorBio() {
  return await client.fetch(
    `*[_type == "author"][0]{name, image, biography, 'slug': slug.current, _id}`
  );
}

// ------------------------------------- //

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

// export async function getPreviewPostBySlug(slug) {
//   // const data = await getClient(true).fetch(
//   const data = await previewClient.fetch(
//     // TODO: what's wrong with this complete version of the query?
//     // `*[_type == "post" && slug.current == $slug] | order(publishedAt desc){
//     //   ${postFields}
//     //   body
//     // }`,
//     // We only need to fetch the slug in order to verify that a post with the provided slug exists.
//     // We could fetch all of the post's data, but that's unnecessary and is throwing errors.
//     `*[_type == "post" && slug.current == $slug] | order(publishedAt desc){
//       title,
//       'slug': slug.current
//     }`,
//     { slug }
//   );
//   return data[0];
// }

export async function getAllPostsWithSlug() {
  // return await client.fetch(`*[_type == "post"]{ 'slug': slug.current }`);
  return await client.fetch(
    `*[_type == "post" && defined(slug.current)]{ "params": { "slug": slug.current } }`
  );
}

export async function getAllPostsForHome() {
  const results = await client.fetch(`*[_type == "post"] | order(publishedAt desc){
      ${postFields}
    }`);
  return getUniquePosts(results);
}

// ------------------------ //

export const postFields = `
  _id,
  name,
  title,
  'date': publishedAt,
  excerpt,
  'slug': slug.current,
  'image': image,
  'imageMeta': image.asset->{...},
  'author': author->{name, 'picture': image.asset->url},
`;

export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    name,
    title,
    'date': publishedAt,
    slug,
    'image': image,
    'imageMeta': image.asset->{...},
    'author': author->{name, 'picture': image.asset->url},
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
  }
`;

export async function getPostBySlug(slug) {
  return await client.fetch(postBySlugQuery, { slug });
  // .then(res => res?.[0]);
}

// ------------------------ //

export async function getPostAndMorePosts(slug) {
  const [post, morePosts] = await Promise.all([
    client
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
    client.fetch(
      `*[_type == "post" && slug.current != $slug] | order(publishedAt desc, _updatedAt desc) {
        ${postFields}
        body,
      }[0...2]`,
      { slug }
    )
  ]);
  return { post, morePosts: getUniquePosts(morePosts) };
}
