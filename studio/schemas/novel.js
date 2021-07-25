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
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          name: "image",
          title: "Image",
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
            },
            {
              title: "Link URL",
              description: "URL of the page this image should link to",
              name: "url",
              type: "url",
              options: {
                isHighlighted: true
              }
            }
          ]
        }
      ]
    },
    {
      name: "synopsis",
      title: "Synopsis",
      type: "blockContent"
    },
    {
      name: "reviews",
      title: "Reviews",
      type: "array",
      of: [{ type: "reference", to: { type: "review" } }]
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
      media: "images.0"
    },
    prepare(selection) {
      const { author } = selection;
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`
      });
    }
  }

  // See: https://www.sanity.io/docs/previews-list-views
  // preview: {
  //   select: {
  //     images: "images",
  //     image: "images.0"
  //   },
  //   prepare(selection) {
  //     const { images, image } = selection;

  //     return {
  //       title: `Gallery block of ${Object.keys(images).length} images`,
  //       subtitle: `Alt text: ${image.alt}`,
  //       media: image
  //     };
  //   }
  // }
};
export default NovelSchema;
