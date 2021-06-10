const environments = {
  production: "https://sandiplewis-blog.vercel.app",
  development: "https://sandiplewis-blog-dev.vercel.app",
  local: "http://localhost:3000"
};
const projectUrl = environments[process.env.SANITY_STUDIO_BUILD_ENV] || environments[local];
const previewSecret = process.env.SANITY_STUDIO_PREVIEW_SECRET;

// See: https://nextjs.org/docs/advanced-features/preview-mode

export default function resolveProductionUrl(document) {
  return `${projectUrl}/api/preview?secret=${previewSecret}&slug=${document.slug.current}`
}