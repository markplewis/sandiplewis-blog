import {
  createImageUrlBuilder,
  createPortableTextComponent,
  createPreviewSubscriptionHook,
  createCurrentUserHook
} from "next-sanity";

import config from "lib/config";

/**
 * Helper function for generating image URLs
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
 * Component for rendering block content
 * https://github.com/sanity-io/block-content-to-react
 */
export const PortableText = createPortableTextComponent({ ...config, serializers: {} });

/**
 * User data hook
 */
export const useCurrentUser = createCurrentUserHook(config);
