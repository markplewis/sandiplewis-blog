import Image from "next/image";
import { urlFor } from "lib/sanity";

import styles from "components/PostBodyImage.module.css";
import { rem } from "utils/units";

const PostBodyImage = ({ node }) => {
  const alignmentClass = node.alignment ? `align-${node.alignment}` : "";
  const creditLine = node?.asset?.creditLine;
  const width = node?.asset?.metadata?.dimensions?.width;
  const height = node?.asset?.metadata?.dimensions?.height;

  let orientation = "square";
  if (width > height) {
    orientation = "landscape";
  } else if (height > width) {
    orientation = "portrait";
  }
  // 9:14 aspect ratio for portrait, 3:2 for landscape
  let imageWidth;
  let imageHeight;
  switch (orientation) {
    case "square":
      imageWidth = node.alignment === "center" ? 600 : 400;
      imageHeight = node.alignment === "center" ? 600 : 400;
      break;
    case "portrait":
      imageWidth = node.alignment === "center" ? 400 : 267;
      imageHeight = node.alignment === "center" ? 600 : 400;
      break;
    case "landscape":
    default:
      imageWidth = node.alignment === "center" ? 600 : 400;
      imageHeight = node.alignment === "center" ? 400 : 267;
      break;
  }
  // TODO: how to get expanded asset object with metadata, etc., like we're doing in `CoverImage`
  // See this, maybe? https://github.com/sanity-io/block-content-to-react#specifying-image-options
  const image = node.asset ? (
    <Image
      src={urlFor(node.asset)
        .width(imageWidth * 2)
        .height(imageHeight * 2)
        .url()}
      width={imageWidth}
      height={imageHeight}
      // Media query `max-width` must match the one in `PostBodyImage.module.css`
      sizes={`(max-width: 800px) 100vw, ${imageWidth * 2}px`}
      layout="responsive"
      alt={node?.alt}
      placeholder="blur"
      // Data URL generated here: https://png-pixel.com/
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
    />
  ) : null;

  return node.caption ? (
    <figure
      className={`${styles.image} ${styles[alignmentClass]}`}
      style={{ maxWidth: rem(imageWidth) }}>
      {image}
      <figcaption>{node.caption}</figcaption>
      {creditLine && <p>Photo credit: {creditLine}</p>}
    </figure>
  ) : (
    <div
      className={`${styles.image} ${styles[alignmentClass]}`}
      style={{ maxWidth: rem(imageWidth) }}>
      {image}
      {creditLine && <p>Photo credit: {creditLine}</p>}
    </div>
  );
};

export default PostBodyImage;
