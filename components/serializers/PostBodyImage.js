import Image from "next/image";
import { urlFor } from "lib/sanity";
import styles from "components/serializers/PostBodyImage.module.css";
import { processCreditLine } from "utils/strings";
import { rem } from "utils/units";
import useMediaQuery from "utils/useMediaQuery";

const PostBodyImage = ({ node }) => {
  const isMedium = useMediaQuery(`(min-width: ${rem(800)})`);
  const alignment = isMedium ? node.alignment : "center";
  const alignmentClass = alignment ? `align-${alignment}` : "";
  const width = node?.asset?.metadata?.dimensions?.width ?? 0;
  const height = node?.asset?.metadata?.dimensions?.height ?? 0;
  const creditLine = processCreditLine(node?.asset?.creditLine);

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
      imageWidth = alignment === "center" ? 600 : 200;
      imageHeight = alignment === "center" ? 600 : 200;
      break;
    case "portrait":
      imageWidth = alignment === "center" ? 400 : 188;
      imageHeight = alignment === "center" ? 622 : 292;
      break;
    case "landscape":
    default:
      imageWidth = alignment === "center" ? 600 : 300;
      imageHeight = alignment === "center" ? 400 : 200;
      break;
  }
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

  return (
    <figure
      className={`${styles.figure} ${styles[alignmentClass]}`}
      style={{ maxWidth: rem(imageWidth) }}>
      {image}
      <figcaption className={styles.caption}>
        {node.caption && <span>{node.caption}</span>}{" "}
        {creditLine && <span dangerouslySetInnerHTML={{ __html: `Photo: ${creditLine}` }} />}
      </figcaption>
    </figure>
  );
};

export default PostBodyImage;
