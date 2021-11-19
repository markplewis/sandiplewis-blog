This directory contains Sanity client configuration data and helper functions for interacting with the Sanity API.

The files in this directory are organized as follows:

- `config.js`: exports the Sanity `projectId`, `dataset`, `apiVersion`, and other Sanity client configuration data.
- `sanity.js`: imports and exports the configurated helper functions that are needed in our client-side code (like `urlFor` and `usePreviewSubscription`).
- `sanity.server.js`: creates the client(s) that are needed for interacting with content in server-side data-fetching functions and in serverless API routes.

See: https://github.com/sanity-io/next-sanity#optimizing-bundle-size
