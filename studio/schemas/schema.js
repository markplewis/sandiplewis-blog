// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";

// We import object and document schemas
import author from "./author";
import blockContent from "./blockContent";
import category from "./category";
import comment from "./comment";
import contactFormSubmission from "./contactFormSubmission";
import homePage from "./homePage";
import novel from "./novel";
import shortStory from "./shortStory";
import post from "./post";
import review from "./review";
import settings from "./settings";

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: "default",
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    // The following are document types which will appear
    // in the studio, in this order
    homePage,
    post,
    category,
    novel,
    shortStory,
    review,
    author,
    blockContent,
    contactFormSubmission,
    comment,
    settings
    // When added to this list, object types can be used as
    // { type: 'typename' } in other document schemas
  ])
});
