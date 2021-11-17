// ------------------------------------------------------------------------------------ //
// The contents of this file have been commented out because comment functionality
// has been disabled
// ------------------------------------------------------------------------------------ //

// Next.js API route documentation:
// https://nextjs.org/learn/basics/api-routes/creating-api-routes
// https://nextjs.org/learn/basics/api-routes/api-routes-details

// Sanity Client API documentation: https://www.npmjs.com/package/@sanity/client

/*
import { previewClient } from "lib/sanity.server";

export default async function createComment(req, res) {
  const { _id, name, email, comment } = JSON.parse(req.body);
  try {
    await previewClient.create({
      _type: "comment",
      post: {
        _type: "reference",
        _ref: _id
      },
      name,
      email,
      comment
    });
  } catch (err) {
    return res.status(500).json({ message: "failure", err });
  }
  return res.status(200).json({ message: "success" });
}
*/
