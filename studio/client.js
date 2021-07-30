import sanityClient from "part:@sanity/base/client";

// See: https://www.sanity.io/help/studio-client-specify-api-version

const client = sanityClient.withConfig({
  apiVersion: process.env.SANITY_STUDIO_API_VERSION
});

export default client;
