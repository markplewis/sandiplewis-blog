// ------------------------------------------------------------------------------------ //
// The contents of this file have been commented out because we're using Sanity's live
// subscription-based preview feature instead of Next's cookie-based preview mode.
//
// Sanity previews:
// - https://www.sanity.io/docs/preview-content-on-site
// - https://github.com/sanity-io/next-sanity#live-real-time-preview
//
// Next previews:
// - https://nextjs.org/docs/advanced-features/preview-mode
// ------------------------------------------------------------------------------------ //

/*
// Sanity Studio makes requests to this endpoint while in preview mode.
// See `studio/resolveProductionUrl.js`

import { client } from "lib/sanity.server";

const postBySlugQuery = `
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

export default async function preview(req, res) {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== process.env.SANITY_STUDIO_PREVIEW_SECRET || !req.query.slug) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  const post = await client.fetch(postBySlugQuery, { slug: req.query.slug });

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!post) {
    return res.status(401).json({ message: "Invalid slug" });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.writeHead(307, { Location: `/posts/${post.slug}` });
  res.end();
}
*/
