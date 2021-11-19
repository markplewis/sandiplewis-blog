import InternalLink from "components/serializers/InternalLink";
import LineBreak from "components/serializers/LineBreak";
import PostBodyImage from "components/serializers/PostBodyImage";

import { PortableText } from "lib/sanity";

import styles from "components/PostBody.module.css";

// TODO: organize/explain all of these links:
// https://www.sanity.io/docs/image-url
// https://www.sanity.io/docs/presenting-block-text
// https://github.com/sanity-io/block-content-to-react
// https://www.sanity.io/docs/block-type
// https://gist.github.com/vramdal/ac326a5bf5a4f2755dfe5e64125fceb1
// https://medium.com/@kimbjrkman/how-to-use-inline-images-in-rich-text-with-sanity-io-c42594baa509
// https://www.sanity.io/guides/portable-text-internal-and-external-links

const serializers = {
  types: {
    image: ({ node }) => <PostBodyImage node={node} />,
    break: ({ node }) => <LineBreak node={node} />
  },
  marks: {
    internalLink: ({ mark, children }) => <InternalLink mark={mark}>{children}</InternalLink>
  }
};

export default function PostBody({ content }) {
  return (
    <div className={styles.body}>
      <PortableText className={styles.bodyBlock} blocks={content} serializers={serializers} />
    </div>
  );
}
