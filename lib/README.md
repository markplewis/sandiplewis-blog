The files in this directory are organized as follows:

- `config.js`: exports the Sanity `projectId`, `dataset`, `apiVersion`, and other Sanity client configuration data.
- `sanity.js`: imports and exports the configurated helper functions that are needed in our client-side code (like `urlFor` and `usePreviewSubscription`).
- `sanity.server.js`: creates the client(s) that are needed for interacting with content in server-side data-fetching functions and in serverless API routes.

See: https://github.com/sanity-io/next-sanity#optimizing-bundle-size

Miscellaneous info (to be organized later):

- https://github.com/sanity-io/next-sanity
- https://www.sanity.io/docs/presenting-images
- https://nextjs.org/docs/basic-features/image-optimization
- https://nextjs.org/docs/api-reference/next/image
