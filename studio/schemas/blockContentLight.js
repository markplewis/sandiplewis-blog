import { AiOutlinePaperClip } from "react-icons/ai";

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContentLight'
 *  }
 */
const BlockContentLightSchema = {
  title: "Block Content Light",
  name: "blockContentLight",
  type: "array",
  of: [
    {
      title: "Block",
      type: "block",
      styles: [{ title: "Normal", value: "normal" }],
      lists: [],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Underline", value: "underline" },
          { title: "Strike", value: "strike-through" }
        ],
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url"
              }
            ]
          },
          {
            title: "Internal link",
            name: "internalLink",
            type: "object",
            blockEditor: {
              icon: AiOutlinePaperClip
            },
            fields: [
              {
                name: "reference",
                type: "reference",
                to: [{ type: "post" }, { type: "novel" }, { type: "shortStory" }]
              }
            ]
          }
        ]
      }
    }
  ]
};
export default BlockContentLightSchema;
