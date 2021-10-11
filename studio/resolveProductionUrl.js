const environments = {
  production: "https://www.sandiplewis.com",
  development: "https://sandiplewis-blog-dev.vercel.app",
  local: "http://localhost:3000"
};
const projectUrl = environments[process.env.SANITY_STUDIO_BUILD_ENV] || environments.local;

// We're using Sanity's live subscription-based preview feature
// instead of Next's cookie-based preview mode

export default function resolveProductionUrl(document) {
  const doc = document.displayed || document;

  if (doc._type && doc.slug) {
    const type = doc._type === "shortStory" ? "short-stories" : `${doc._type}s`;
    return `${projectUrl}/${type}/${doc.slug.current}`;
  } else if (doc._type === "homePage") {
    return `${projectUrl}/`;
  }
  return null;
}

// ------------------------------- //
/*
// For Next.js' built-in preview mode (which opens in a separate tab and sets a cookie)
const previewSecret = process.env.SANITY_STUDIO_PREVIEW_SECRET;

export default function resolveProductionUrl(document) {
  return `${projectUrl}/api/preview?secret=${previewSecret}&slug=${document.slug.current}`;
}
// Documentation:
// https://www.sanity.io/docs/preview-content-on-site
// https://nextjs.org/docs/advanced-features/preview-mode
*/
