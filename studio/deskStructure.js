import S from "@sanity/desk-tool/structure-builder";

// https://www.sanity.io/docs/icons-for-data-types
import EyeIcon from "part:@sanity/base/eye-icon";
import EditIcon from "part:@sanity/base/edit-icon";

import IframePreview from "./components/IframePreview";

// Structure Builder resources:
// https://www.sanity.io/docs/structure-builder-reference
// https://www.sanity.io/docs/structure-builder-introduction

// Singletons:
// https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list

// Split pane previews:
// https://www.sanity.io/blog/evolve-authoring-experiences-with-views-and-split-panes
// https://github.com/sanity-io/gatsby-portfolio-preview-poc/blob/master/studio/README.md

function splitPaneViews(title, schema, previewTitle) {
  return S.listItem()
    .title(title)
    .schemaType(schema)
    .child(
      S.documentTypeList(schema)
        .title(title)
        .child(documentId =>
          S.document()
            .documentId(documentId)
            .schemaType(schema)
            .views([
              S.view.form().icon(EditIcon),
              S.view.component(IframePreview).icon(EyeIcon).title(previewTitle)
            ])
        )
    );
}

const DeskStructure = () =>
  S.list()
    .title("Content")
    .items([
      // TODO: fix this error: https://www.sanity.io/help/input-component-no-ref
      S.listItem()
        .title("Home page")
        .schemaType("homePage")
        .child(
          S.document()
            .documentId("homePage")
            .schemaType("homePage")
            .views([
              S.view.form().icon(EditIcon),
              S.view.component(IframePreview).icon(EyeIcon).title("Web Preview")
            ])
        ),
      splitPaneViews("Post", "post", "Web Preview"),
      splitPaneViews("Novel", "novel", "Web Preview"),
      splitPaneViews("Author", "author", "Web Preview"),
      ...S.documentTypeListItems().filter(listItem => {
        return !["homePage", "post", "novel", "author", "settings"].includes(listItem.getId());
      }),
      S.listItem()
        .title("Settings")
        .child(S.document().schemaType("settings").documentId("settings"))
    ]);

export default DeskStructure;
