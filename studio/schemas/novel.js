import client from "part:@sanity/base/client";

const NovelSchema = {
  name: "novel",
  title: "Novel",
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
        },
        {
          title: "Caption",
          description: "An optional caption to display alongside the photo",
          name: "caption",
          type: "text",
          rows: 3,
          options: {
            isHighlighted: true
          }
        }
      ]
    },
    // {
    //   name: "images",
    //   title: "Images",
    //   type: "array",
    //   options: {
    //     layout: "grid"
    //   },
    //   of: [
    //     {
    //       name: "image",
    //       title: "Image",
    //       type: "image",
    //       options: {
    //         hotspot: true
    //       },
    //       fields: [
    //         {
    //           title: "Alternative Text",
    //           description: "A short description of the photo (for screen readers)",
    //           name: "alt",
    //           type: "string",
    //           validation: Rule => Rule.required(),
    //           options: {
    //             isHighlighted: true
    //           }
    //         },
    //         {
    //           title: "Caption",
    //           description: "An optional caption to display alongside the photo",
    //           name: "caption",
    //           type: "text",
    //           rows: 3,
    //           options: {
    //             isHighlighted: true
    //           }
    //         },
    //         {
    //           title: "Link URL",
    //           description: "URL of the page this image should link to",
    //           name: "url",
    //           type: "url",
    //           options: {
    //             isHighlighted: true
    //           }
    //         }
    //       ]
    //     }
    //   ]
    // },
    {
      name: "overview",
      title: "Overview",
      description: "A brief overview that will appear when this novel is featured on the home page",
      type: "array",
      of: [{ type: "block" }]
    },
    // See: https://www.sanity.io/docs/block-type
    {
      name: "synopsis",
      title: "Synopsis",
      description: "A full-length synopsis",
      type: "blockContent"
    }
  ],

  // See: https://www.sanity.io/guides/getting-started-with-initial-values-for-new-documents
  // And: https://www.sanity.io/docs/query-cheat-sheet
  initialValue: async () => ({
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
export default NovelSchema;
