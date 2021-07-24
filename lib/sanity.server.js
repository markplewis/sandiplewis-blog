import { createClient } from "next-sanity";
import { config } from "lib/config";

// Set up the client for fetching data in the `getStaticProps` and `getStaticPaths` page functions
export const client = createClient(config);

// Set up a preview client with serverless authentication for drafts
export const previewClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

// export const commentClient = createClient({
//   ...config,
//   token: process.env.SANITY_API_TOKEN
// })

// Helper function for easily switching between normal client and preview client
export const getClient = usePreview => (usePreview ? previewClient : client);
