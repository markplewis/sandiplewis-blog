import {
  createImageUrlBuilder,
  // createPortableTextComponent,
  createPreviewSubscriptionHook,
  createCurrentUserHook
} from "next-sanity";

import config from "lib/config";

// "Import and export the configurated helper functions that you need in the client-side code"
// See: https://github.com/sanity-io/next-sanity#optimizing-bundle-size

// Set up a helper function for generating Image URLs with only the asset reference data in your documents.
// See: https://www.sanity.io/docs/image-url
export const urlFor = source => createImageUrlBuilder(config).image(source);

// Set up the live preview subscription hook
export const usePreviewSubscription = createPreviewSubscriptionHook(config);

// Set up Portable Text serialization
// export const PortableText = createPortableTextComponent({
//   ...config,
//   // Serializers passed to @sanity/block-content-to-react
//   // (https://github.com/sanity-io/block-content-to-react)
//   serializers: {}
// });

// Helper function for using the current logged in user account
export const useCurrentUser = createCurrentUserHook(config);

// Miscellaneous:
// https://github.com/sanity-io/next-sanity
// https://www.sanity.io/docs/presenting-images
// https://nextjs.org/docs/basic-features/image-optimization
// https://nextjs.org/docs/api-reference/next/image
