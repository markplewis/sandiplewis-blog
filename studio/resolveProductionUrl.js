// const projectUrl = 'http://localhost:3000'

// const projectUrl = process.env.SANITY_STUDIO_API_DATASET === "production"
//   ? "https://sandiplewis-blog.vercel.app"
//   : "https://sandiplewis-blog-dev.vercel.app";

const environments = {
  production: "https://sandiplewis-blog.vercel.app",
  development: "https://sandiplewis-blog-dev.vercel.app",
  local: "http://localhost:3000"
};
const projectUrl = environments[process.env.SANITY_STUDIO_BUILD_ENV] || environments[local];
const previewSecret = process.env.SANITY_STUDIO_PREVIEW_SECRET;

export default function resolveProductionUrl(document) {
  return `${projectUrl}/api/preview?secret=${previewSecret}&slug=${document.slug.current}`
}