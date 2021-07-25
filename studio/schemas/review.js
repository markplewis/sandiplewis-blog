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
      name: "reviewer",
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
      reviewer: "reviewer",
      novel: "novel.title"
    },
    prepare(selection) {
      const { title, reviewer, novel } = selection;
      return Object.assign({}, selection, {
        title: title,
        subtitle: [reviewer && `by ${reviewer}`, novel && `(${novel})`].filter(v => v).join(" ")
      });
    }
  }
};
export default ReviewSchema;
