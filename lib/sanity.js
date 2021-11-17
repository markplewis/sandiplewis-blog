import {
  createImageUrlBuilder,
  // createPortableTextComponent,
  createPreviewSubscriptionHook,
  createCurrentUserHook
} from "next-sanity";

import config from "lib/config";

/**
 * Helper function for generating image URLs using only asset reference data from our documents
 * https://www.sanity.io/docs/image-url
 * https://github.com/sanity-io/image-url#imagesource
 */
export const urlFor = source => createImageUrlBuilder(config).image(source);

/**
 * Live preview subscription hook
 * https://www.sanity.io/docs/preview-content-on-site
 * https://www.sanity.io/blog/live-preview-with-nextjs
 * https://github.com/sanity-io/next-sanity#live-real-time-preview
 * https://www.npmjs.com/package/next-sanity/v/0.1.4
 */
export const usePreviewSubscription = createPreviewSubscriptionHook(config);

/**
 * Portable Text serialization
 */
// export const PortableText = createPortableTextComponent({
//   ...config,
//   // Serializers passed to @sanity/block-content-to-react
//   // (https://github.com/sanity-io/block-content-to-react)
//   serializers: {}
// });

/**
 * Helper function for using the currently logged-in user's account
 */
export const useCurrentUser = createCurrentUserHook(config);
