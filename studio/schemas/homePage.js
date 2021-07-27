// See: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list

const HomePageSchema = {
  name: "homePage",
  title: "Home page",
  type: "document",
  __experimental_actions: ["update", "publish"], // Removed "create" and "delete"
  initialValue: {
    name: "Home page"
  },
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
    }
  ]
};
export default HomePageSchema;
