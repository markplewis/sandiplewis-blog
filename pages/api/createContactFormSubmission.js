// ------------------------------------------------------------------------------------ //
// The contents of this file have been commented out because we're no longer storing
// contact form submissions in our Sanity content lake
// ------------------------------------------------------------------------------------ //

// Next.js API route documentation:
// https://nextjs.org/learn/basics/api-routes/creating-api-routes
// https://nextjs.org/learn/basics/api-routes/api-routes-details

// Sanity Client API documentation: https://www.npmjs.com/package/@sanity/client

/*
import { previewClient } from "lib/sanity.server";

export default async function createContactFormSubmission(req, res) {
  const { name, email, message } = JSON.parse(req.body);
  try {
    await previewClient.create({
      _type: "contactFormSubmission",
      name,
      email,
      message
    });
  } catch (err) {
    return res.status(500).json({ message: "failure", err });
  }
  return res.status(200).json({ message: "success" });
}
*/
