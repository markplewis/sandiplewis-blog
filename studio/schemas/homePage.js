// See: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list

const HomePageSchema = {
  name: "homePage",
  title: "Home page",
  type: "document",
  __experimental_actions: ["update", "publish"], // Removed "create" and "delete"
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      hidden: true
    },
    {
      name: "novel",
      title: "Featured novel",
      description: "A novel to feature on the home page",
      type: "reference",
      to: { type: "novel" }
    },
    {
      name: "reviews",
      title: "Featured reviews",
      description: "One or two of the featured novel's reviews",
      type: "array",
      of: [{ type: "reference", to: { type: "review" } }],
      validation: Rule => Rule.unique().max(2)
    },
    {
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" }
    },
    {
      name: "commentsEnabled",
      title: "Enable comments",
      description: "Enable or disable comments on posts",
      type: "boolean"
    }
  ],
  initialValue: {
    name: "Home page",
    commentsEnabled: false
  }
};
export default HomePageSchema;
