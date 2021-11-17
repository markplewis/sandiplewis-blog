import createSchema from "part:@sanity/base/schema-creator";
// Import schema types from any plugins that may expose them
import schemaTypes from "all:part:@sanity/base/schema-type";

// Import our object and document schemas
import author from "./author";
import blockContent from "./blockContent";
import category from "./category";
import homePage from "./homePage";
import novel from "./novel";
import shortStory from "./shortStory";
import post from "./post";
import review from "./review";

// The following schemas are not being used but I've left the code commented out for reference
// import comment from "./comment";
// import contactFormSubmission from "./contactFormSubmission";
// import settings from "./settings";

// Give our schema to the builder and provide the results to Sanity
export default createSchema({
  name: "default",
  // Concatenate our document types with the ones provided by any plugins that may be installed
  types: schemaTypes.concat([
    // The following document types will appear inside Sanity Studio, in the order defined here.
    // The document types listed here can be referenced by name in other document schemas, for
    // example: `fields: [{ name: "reference", type: "reference", to: [{ type: "shortStory" }] }]`
    homePage,
    post,
    category,
    novel,
    shortStory,
    review,
    author,
    blockContent
    // contactFormSubmission,
    // comment,
    // settings
  ])
});
