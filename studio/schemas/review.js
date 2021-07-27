const ReviewSchema = {
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string"
    },
    {
      name: "review",
      title: "Review",
      type: "text"
    },
    {
      name: "author",
      title: "Reviewer's name",
      type: "string"
    },
    {
      name: "novel",
      title: "Novel being reviewed",
      type: "reference",
      to: { type: "novel" }
    }
  ],
  preview: {
    select: {
      title: "title",
      author: "author",
      novel: "novel.title"
    },
    prepare(selection) {
      const { title, author, novel } = selection;
      return Object.assign({}, selection, {
        title: title,
        subtitle: [author && `by ${author}`, novel && `(${novel})`].filter(v => v).join(" ")
      });
    }
  }
};
export default ReviewSchema;
