import client from "../client";

const PostSchema = {
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string"
    },
    {
      name: "slug",
      title: "Slug",
      description: "This will appear in the page's URL",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96
      }
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
      name: "category",
      title: "Category",
      type: "reference",
      to: { type: "category" }
    },
    // See: https://github.com/rosnovsky/sanity-plugin-autocomplete-tags
    // {
    //   name: "tags",
    //   title: "Tags",
    //   type: "tags"
    // },
    // {
    //   title: "Tags",
    //   name: "tags",
    //   type: "array",
    //   of: [{ type: "string" }],
    //   options: {
    //     layout: "tags"
    //   }
    // },
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
      name: "body",
      title: "Body",
      type: "blockContent"
    }
  ],

  // See: https://www.sanity.io/guides/getting-started-with-initial-values-for-new-documents
  // And: https://www.sanity.io/docs/query-cheat-sheet
  initialValue: async () => ({
    publishedAt: new Date().toISOString(),
    author: await client.fetch(`
      *[_type == "author"][0]{
        "_type": "reference",
        "_ref": _id
      }
    `)
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
