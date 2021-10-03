import BlockContent from "@sanity/block-content-to-react";
import config from "lib/config";
import PostBodyImage from "components/serializers/PostBodyImage";
import { internalLinkSerializer } from "utils/serializers";

import styles from "components/PostBody.module.css";

// https://www.sanity.io/docs/image-url
// https://www.sanity.io/docs/presenting-block-text
// https://github.com/sanity-io/block-content-to-react
// https://www.sanity.io/docs/block-type
// https://gist.github.com/vramdal/ac326a5bf5a4f2755dfe5e64125fceb1
// https://medium.com/@kimbjrkman/how-to-use-inline-images-in-rich-text-with-sanity-io-c42594baa509
// https://www.sanity.io/guides/portable-text-internal-and-external-links

const serializers = {
  types: {
    // eslint-disable-next-line react/display-name
    image: ({ node }) => <PostBodyImage node={node} />
  },
  marks: internalLinkSerializer
};

export default function PostBody({ content }) {
  return (
    <div className={styles.body}>
      <BlockContent
        blocks={content}
        serializers={serializers}
        projectId={config.projectId}
        dataset={config.dataset}
      />
    </div>
  );
}
