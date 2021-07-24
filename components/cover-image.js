import Image from "next/image";
import Link from "next/link";
import { imageBuilder } from "lib/sanity";
import { getColorData } from "utils/color";
import useDebug from "utils/useDebug";

import swatchStyles from "components/cover-image-styles.module.css";

export default function CoverImage({ title, imageObject, imageMeta, slug }) {
  const { colorData, swatches } = getColorData(imageMeta?.metadata?.palette);
  const debug = useDebug();
  const swatchOutput = debug ? <div>{swatches}</div> : null;

  console.log("colorData", colorData);

  // See: https://nextjs.org/docs/api-reference/next/image
  // Can't produce <picture> elements (no art direction)
  const image = (
    <>
      <Image
        src={imageBuilder(imageObject).width(1240).height(540).url()}
        width={1240}
        height={540}
        sizes="(max-width: 800px) 100vw, 800px"
        layout="responsive"
        alt={imageObject.alt}
        placeholder="blur"
        // Data URL generated here: https://png-pixel.com/
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
      />

      {imageMeta?.creditLine ? `Credit: ${imageMeta.creditLine}` : ""}

      <div>
        {colorData?.vibrant?.base ? (
          <div
            className={swatchStyles.swatch}
            style={{
              backgroundColor: colorData?.vibrant?.base?.background,
              color: colorData?.vibrant?.base?.foreground
            }}>
            Base
          </div>
        ) : null}
        {colorData?.vibrant?.complimentary ? (
          <div
            className={swatchStyles.swatch}
            style={{
              backgroundColor: colorData?.vibrant?.complimentary?.background,
              color: colorData?.vibrant?.complimentary?.foreground
            }}>
            Comp
          </div>
        ) : null}
      </div>
    </>
  );

  return (
    <div className="-mx-5 sm:mx-0">
      {slug ? (
        <>
          <Link as={`/posts/${slug}`} href="/posts/[slug]">
            <a aria-label={title}>{image}</a>
          </Link>
          {swatchOutput}
        </>
      ) : (
        <>
          {image}
          {swatchOutput}
        </>
      )}
    </div>
  );
}
