// These values are repeated in `lib/constants.js`
const environments = {
  production: "https://www.sandiplewis.com",
  development: "https://dev.sandiplewis.com",
  local: "http://localhost:3000"
};
const projectUrl = environments[process.env.SANITY_STUDIO_BUILD_ENV] || environments.local;

// We're using Sanity's live subscription-based preview feature
// instead of Next's cookie-based preview mode

export default function resolveProductionUrl(document) {
  const doc = document.displayed || document;

  if (doc._type === "homePage") {
    return `${projectUrl}/`;
  } else if (doc._type && doc.slug) {
    let type;
    switch (doc._type) {
      case "shortStory":
        type = "short-stories";
        break;
      case "category":
        type = "categories";
        break;
      default:
        type = `${doc._type}s`;
        break;
    }
    return `${projectUrl}/${type}/${doc.slug.current}`;
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
