import Image from "next/image";
import { urlFor } from "lib/sanity";

import styles from "components/PostBodyImage.module.css";

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

  const alignmentClass = node.alignment ? `align-${node.alignment}` : "";

  return node.caption ? (
    <figure className={`${styles.image} ${styles[alignmentClass]}`}>
      {image}
      <figcaption>{node.caption}</figcaption>
    </figure>
  ) : (
    <div className={styles[alignmentClass]}>{image}</div>
  );
};

export default PostBodyImage;
