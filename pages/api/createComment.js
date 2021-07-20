import sanityClient from "@sanity/client";

// TODO: why not this?
// import {commentClient} from './sanity.server'

const config = {
  dataset: process.env.SANITY_STUDIO_API_DATASET || "production",
  projectId: process.env.SANITY_STUDIO_API_PROJECT_ID,
  apiVersion: "2021-03-25",
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN
};
const client = sanityClient(config);

// See: https://nextjs.org/learn/basics/api-routes/creating-api-routes
// And: https://nextjs.org/learn/basics/api-routes/api-routes-details

export default async function createComment(req, res) {
  const { _id, name, email, comment } = JSON.parse(req.body);
  try {
    await client.create({
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
    console.error(err);
    return res.status(500).json({ message: `Couldn't submit comment`, err });
  }
  return res.status(200).json({ message: "Comment submitted" });
}
