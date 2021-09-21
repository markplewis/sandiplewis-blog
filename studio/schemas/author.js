import colorFields from "../fields/colors";
import description from "../fields/description";

const AuthorSchema = {
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: Rule => Rule.required()
    },
    {
      name: "slug",
      title: "Slug",
      description: "This will appear in the page's URL",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    ...colorFields,
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true
      }
    },
    {
      name: "shortBiography",
      title: "Short biography",
      description: "Brief overview that will appear on the home page",
      type: "array",
      of: [
        {
          title: "Block",
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: []
        }
      ]
    },
    {
      name: "biography",
      title: "Full biography",
      type: "blockContent"
    },
    description
  ],
  preview: {
    select: {
      title: "name",
      media: "image"
    }
  }
};
export default AuthorSchema;
