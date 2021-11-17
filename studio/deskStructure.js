import S from "@sanity/desk-tool/structure-builder";

// https://www.sanity.io/docs/icons-for-data-types
import EyeIcon from "part:@sanity/base/eye-icon";
import EditIcon from "part:@sanity/base/edit-icon";
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineUser,
  HiOutlineDocumentText,
  // HiOutlineCog,
  HiOutlineChat,
  HiOutlineFolderOpen,
  HiOutlineStar
} from "react-icons/hi";

import IframePreview from "./components/IframePreview";

// Structure Builder resources:
// https://www.sanity.io/docs/structure-builder-reference
// https://www.sanity.io/docs/structure-builder-introduction

// Singletons:
// https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list

// Split pane previews:
// https://www.sanity.io/blog/evolve-authoring-experiences-with-views-and-split-panes
// https://github.com/sanity-io/gatsby-portfolio-preview-poc/blob/master/studio/README.md

function splitPaneViews(listItem, title, schema, Icon) {
  return listItem
    .title(title)
    .schemaType(schema)
    .icon(Icon)
    .child(
      S.documentTypeList(schema)
        .title(title)
        .child(documentId =>
          S.document()
            .documentId(documentId)
            .schemaType(schema)
            .views([
              S.view.form().icon(EditIcon),
              S.view.component(IframePreview).icon(EyeIcon).title("Web Preview")
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
        .icon(HiOutlineHome)
        .child(
          S.document()
            .documentId("homePage")
            .schemaType("homePage")
            .views([
              S.view.form().icon(EditIcon),
              S.view.component(IframePreview).icon(EyeIcon).title("Web Preview")
            ])
        ),
      ...S.documentTypeListItems()
        .filter(listItem => {
          // return !["homePage", "settings"].includes(listItem.getId());
          return listItem.getId() !== "homePage";
        })
        .map(listItem => {
          switch (listItem.getId()) {
            case "author":
              return splitPaneViews(listItem, "Authors", "author", HiOutlineUser);
            case "category":
              return splitPaneViews(listItem, "Categories", "category", HiOutlineFolderOpen);
            case "comment":
              return listItem.title("Comments").icon(HiOutlineChat);
            case "contactFormSubmission":
              return listItem.title("Contact form").icon(HiOutlineChat);
            case "novel":
              return splitPaneViews(listItem, "Novels", "novel", HiOutlineBookOpen);
            case "shortStory":
              return splitPaneViews(listItem, "Short stories", "shortStory", HiOutlineBookOpen);
            case "post":
              return splitPaneViews(listItem, "Posts", "post", HiOutlineDocumentText);
            case "review":
              return listItem.title("Reviews").icon(HiOutlineStar);
            default:
              return listItem;
          }
        })
      // The settings page has been disabled:
      // S.listItem()
      //   .title("Settings")
      //   .icon(HiOutlineCog)
      //   .child(S.document().documentId("settings").schemaType("settings"))
    ]);

export default DeskStructure;
