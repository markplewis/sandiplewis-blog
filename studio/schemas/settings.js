// See: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list

const SettingsSchema = {
  name: "settings",
  title: "Settings",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      hidden: true
    },
    {
      name: "commentsEnabled",
      title: "Enable comments",
      description: "Enable or disable comments on posts",
      type: "boolean"
    }
  ],
  initialValue: {
    name: "Settings",
    commentsEnabled: false
  }
};
export default SettingsSchema;
