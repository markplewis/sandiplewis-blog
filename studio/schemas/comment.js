const CommentSchema = {
  name: "comment",
  type: "document",
  title: "Comment",
  fields: [
    {
      name: "name",
      type: "string"
    },
    {
      title: "Approved",
      description: "Comments won't show on the site without approval",
      name: "approved",
      type: "boolean"
    },
    {
      name: "email",
      type: "string"
    },
    {
      name: "comment",
      type: "text"
    },
    {
      name: "post",
      type: "reference",
      to: [{ type: "post" }]
    }
  ],
  preview: {
    select: {
      name: "name",
      comment: "comment",
      post: "post.title"
    },
    prepare({ name, comment, post }) {
      return {
        title: `${name} on ${post}`,
        subtitle: comment
      };
    }
  }
};
export default CommentSchema;
