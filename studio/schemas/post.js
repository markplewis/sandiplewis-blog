import client from "../client";

const PostSchema = {
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: Rule => Rule.required()
    },
    {
      name: "slug",
      title: "Slug",
      description: "This will appear in the page's URL",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" }
    },
    {
      name: "publishedAt",
      title: "Published at",
      type: "datetime"
    },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
      validation: Rule => Rule.unique()
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
          { title: "Dark Muted", value: "darkMuted" }
        ],
        layout: "radio" // defaults to "dropdown"
      }
    },
    {
      name: "image",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true
      },
      fields: [
        {
          title: "Alternative Text",
          description: "A short description of the photo (for screen readers)",
          name: "alt",
          type: "string",
          validation: Rule => Rule.required(),
          options: {
            isHighlighted: true
          }
        }
      ]
    },
    {
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 4,
      validation: Rule => Rule.required()
    },
    {
      name: "body",
      title: "Body",
      type: "blockContent"
    }
  ],

  // See: https://www.sanity.io/guides/getting-started-with-initial-values-for-new-documents
  // And: https://www.sanity.io/docs/query-cheat-sheet
  initialValue: async () => ({
    publishedAt: new Date().toISOString(),
    // First author in the database
    author: await client.fetch(`
      *[_type == "author"][0]{
        "_type": "reference",
        "_ref": _id
      }
    `),
    colorPalette: "dominant"
  }),

  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "image"
    },
    prepare(selection) {
      const { author } = selection;
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`
      });
    }
  }
};
export default PostSchema;
