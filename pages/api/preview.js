// ------------------------------------------------------------------------------------ //
// The contents of this file have been commented out because we're using Sanity's live
// subscription-based preview feature instead of Next's cookie-based preview mode
// ------------------------------------------------------------------------------------ //

// https://github.com/sanity-io/next-sanity#live-real-time-preview
// https://nextjs.org/docs/advanced-features/preview-mode#fetch-preview-data

/*
import { getPreviewPostBySlug } from "lib/api";

// Sanity Studio makes requests to this endpoint while in preview mode.
// See `studio/resolveProductionUrl.js`

export default async function preview(req, res) {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== process.env.SANITY_STUDIO_PREVIEW_SECRET || !req.query.slug) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  const post = await getPreviewPostBySlug(req.query.slug);

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
