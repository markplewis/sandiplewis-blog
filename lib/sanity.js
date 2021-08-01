import {
  createClient,
  createImageUrlBuilder,
  createPortableTextComponent,
  createPreviewSubscriptionHook,
  createCurrentUserHook
} from "next-sanity";

import config from "lib/config";

// Set up the client for fetching data in the `getStaticProps` and `getStaticPaths` page functions
export const client = createClient(config);

// Set up a preview client with serverless authentication for drafts (for server side)
export const previewClient = createClient({
  ...config,
  // "The CDN cannot be used with an authorization token, since private data cannot be cached"
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

/**
 * Set up a helper function for generating Image URLs with only the asset reference data in your documents.
 * Read more: https://www.sanity.io/docs/image-url
 **/
export const imageBuilder = source => createImageUrlBuilder(config).image(source);

// Set up the live preview subscription hook
export const usePreviewSubscription = createPreviewSubscriptionHook(config);

// Set up Portable Text serialization
export const PortableText = createPortableTextComponent({
  ...config,
  // Serializers passed to @sanity/block-content-to-react
  // (https://github.com/sanity-io/block-content-to-react)
  serializers: {}
});

// Helper function for using the current logged in user account
export const useCurrentUser = createCurrentUserHook(config);

// ------------------------------- //

// For Next.js' built-in preview mode (which opens in a separate tab and sets a cookie)

// Documentation:
// https://www.sanity.io/docs/preview-content-on-site
// https://nextjs.org/docs/advanced-features/preview-mode

// Helper function for easily switching between normal client and preview client
// export const getClient = usePreview => (usePreview ? previewClient : client);

// https://github.com/sanity-io/next-sanity
// https://www.sanity.io/docs/presenting-images
// https://nextjs.org/docs/basic-features/image-optimization
// https://nextjs.org/docs/api-reference/next/image
