import { createClient } from "next-sanity";
import config from "lib/config";

// The following Sanity clients should never be imported into client-side code; only into
// server-side data-fetching functions like `getStaticProps`, `getServerProps` and `getStaticPaths`,
// or functions inside API routes (i.e. `/pages/api/<your-serverless-function>.js`). See:
// https://github.com/sanity-io/next-sanity#optimizing-bundle-size

// More information about Sanity clients and their API:
// https://www.npmjs.com/package/@sanity/client

// TODO: Since we've disabled comments and therefore no longer need to post data to the Sanity API,
// we should be able to use the lighter-weight `picosanity` client instead of `next-sanity`:
// https://github.com/rexxars/picosanity

/**
 * Sanity client for fetching data
 */
export const client = createClient(config);

/**
 * Sanity client with serverless authentication for posting data
 * (used for Next's cookie-based preview mode, saving comments and form submissions, etc.)
 * See: https://nextjs.org/docs/advanced-features/preview-mode
 */
// export const previewClient = createClient({
//   ...config,
//   // "The CDN cannot be used with an authorization token, since private data cannot be cached"
//   useCdn: false,
//   token: process.env.SANITY_API_TOKEN
// });
