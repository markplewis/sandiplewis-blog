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
      title: "Colour palette",
      name: "colorPalette",
      type: "string",
      options: {
        list: [
          { title: "Dominant", value: "dominant" },
          { title: "Vibrant", value: "vibrant" },
          { title: "Light Vibrant", value: "lightVibrant" },
          { title: "Dark Vibrant", value: "darkVibrant" },
          { title: "Muted", value: "muted" },
          { title: "Light Muted", value: "lightMuted" },
          { title: "Dark Muted", value: "darkMuted" },
          { title: "Custom", value: "custom" }
        ],
        layout: "radio" // defaults to "dropdown"
      }
    },
    {
      name: "primaryColor",
      title: "Primary colour",
      type: "color",
      hidden: ({ parent }) => parent?.colorPalette !== "custom"
    },
    {
      name: "secondaryColor",
      title: "Secondary colour",
      type: "color",
      hidden: ({ parent }) => parent?.colorPalette !== "custom"
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
    }
  ],
  initialValue: {
    name: "Home page"
  }
};
export default HomePageSchema;
