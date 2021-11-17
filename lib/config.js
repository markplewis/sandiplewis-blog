const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  // Set `useCdn` to `false` if your application always requires the freshest possible data
  // (potentially slower and more expensive). Authenticated requests (like Next's preview mode)
  // will always bypass the CDN (see `previewClient` in `lib/sanity.server.js`).
  useCdn: process.env.NODE_ENV === "production"
};
export default config;
