const AuthorSchema = {
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string"
    },
    {
      name: "slug",
      title: "Slug",
      description: "This will appear in the page's URL",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96
      }
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true
      }
    },
    {
      name: "biography",
      title: "Biography",
      type: "array",
      of: [
        {
          title: "Block",
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: []
        }
      ]
    }
  ],
  preview: {
    select: {
      title: "name",
      media: "image"
    }
  }
};
export default AuthorSchema;
