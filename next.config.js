// See: https://nextjs.org/docs/api-reference/next.config.js/introduction
// Extending Next's Webpack config: https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

module.exports = withBundleAnalyzer({
  images: {
    // These apply globally. It doesn't seem possible to specify different sizes per image.
    // https://nextjs.org/docs/basic-features/image-optimization#device-sizes
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    domains: ["cdn.sanity.io"]
  }
});
