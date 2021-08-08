import BlockContent from "@sanity/block-content-to-react";
import Image from "next/image";
import config from "lib/config";
import { urlFor } from "lib/sanity";

// https://www.sanity.io/docs/image-url
// https://www.sanity.io/docs/presenting-block-text
// https://github.com/sanity-io/block-content-to-react
// https://www.sanity.io/docs/block-type
// https://gist.github.com/vramdal/ac326a5bf5a4f2755dfe5e64125fceb1
// https://medium.com/@kimbjrkman/how-to-use-inline-images-in-rich-text-with-sanity-io-c42594baa509
// https://www.sanity.io/guides/portable-text-internal-and-external-links

const PostBodyImage = ({ node }) => {
  // TODO: how to get expanded asset object with metadata, etc., like we're doing in `CoverImage`
  // See this, maybe? https://github.com/sanity-io/block-content-to-react#specifying-image-options
  const image = node.asset ? (
    <Image
      src={urlFor(node.asset).width(1240).height(540).url()}
      width={1240}
      height={540}
      sizes="(max-width: 800px) 100vw, 800px"
      layout="responsive"
      alt={node?.alt}
      placeholder="blur"
      // Data URL generated here: https://png-pixel.com/
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
    />
  ) : null;

  return node.caption ? (
    <figure className={`${node.alignment ? `align-${node.alignment}` : ""}`}>
      {image}
      <figcaption>{node.caption}</figcaption>
    </figure>
  ) : (
    <div className={`${node.alignment ? `align-${node.alignment}` : ""}`}>{image}</div>
  );
};

export default function PostBody({ content }) {
  const serializers = {
    types: {
      // eslint-disable-next-line react/display-name
      image: ({ node }) => <PostBodyImage node={node} />
    }
  };
  return (
    <div>
      <BlockContent
        blocks={content}
        serializers={serializers}
        projectId={config.projectId}
        dataset={config.dataset}
      />
    </div>
  );
}
