import { createClient } from "next-sanity";
import config from "lib/config";

/**
 * "You can leverage Next.js' tree shaking to avoid shipping unnecessary code to the browser. In
 * order to do so, you first need to isolate the client configuration in its own file, and be sure
 * to only use it inside of the data fetching functions (`getStaticProps`, `getServerProps`, and
 * `getStaticPaths`) or in the functions that go into your API routes
 * (`/pages/api/<your-serverless-function>.js`)."
 *
 * See: https://github.com/sanity-io/next-sanity#optimizing-bundle-size
 *
 * TODO: Since we've disabled comments, we should be able to use the lighter-weight `picosanity`
 * client instead of the `next-sanity` client: https://github.com/rexxars/picosanity
 */

// Sanity client for fetching data server-side
export const client = createClient(config);

// Sanity preview client with serverless authentication (used for saving comments and form submissions)
// export const previewClient = createClient({
//   ...config,
//   // "The CDN cannot be used with an authorization token, since private data cannot be cached"
//   useCdn: false,
//   token: process.env.SANITY_API_TOKEN
// });

// ------------------------------------------------------------------------------------ //
// The following has been commented out because we're using Sanity's live
// subscription-based preview feature instead of Next's cookie-based preview mode
//
// Sanity previews:
// - https://www.sanity.io/docs/preview-content-on-site
// - https://github.com/sanity-io/next-sanity#live-real-time-preview
//
// Next previews:
// - https://nextjs.org/docs/advanced-features/preview-mode
// ------------------------------------------------------------------------------------ //

// Helper function for easily switching between normal client and preview client
// export const getClient = usePreview => (usePreview ? previewClient : client);
