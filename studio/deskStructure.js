import S from "@sanity/desk-tool/structure-builder";

// See: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list

const DeskStructure = () =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home page")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      ...S.documentTypeListItems().filter(listItem => !["homePage"].includes(listItem.getId()))
    ]);

export default DeskStructure;
