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
      name: "body",
      title: "Body",
      type: "text"
    },
    {
      name: "name",
      title: "Name",
      type: "string"
    }
  ]
};
export default ReviewSchema;
