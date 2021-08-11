import Image from "next/image";
import Link from "next/link";

import { urlFor } from "lib/sanity";

import { getColorData, getSwatches } from "utils/color";
import useDebug from "utils/useDebug";

import swatchStyles from "components/CoverImage.module.css";

export default function CoverImage({ title, image, slug }) {
  const colorData = getColorData(image?.palette);
  const debug = useDebug();

  const swatches = debug ? getSwatches(colorData) : null;
  const swatchOutput = debug ? <div>{swatches}</div> : null;

  // See: https://nextjs.org/docs/api-reference/next/image
  // Can't produce <picture> elements (no art direction)
  const img = (
    <>
      {image ? (
        <Image
          src={urlFor(image).width(1240).height(540).url()}
          width={1240}
          height={540}
          sizes="(max-width: 800px) 100vw, 800px"
          layout="responsive"
          alt={image?.alt}
          placeholder="blur"
          // Data URL generated here: https://png-pixel.com/
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
        />
      ) : null}

      {image?.creditLine ? `Credit: ${image.creditLine}` : ""}

      <div>
        {colorData?.vibrant?.base ? (
          <div
            className={swatchStyles.swatch}
            style={{
              backgroundColor: colorData?.vibrant?.base?.background,
              color: colorData?.vibrant?.base?.foreground
            }}>
            {colorData?.vibrant?.base?.ratio}
          </div>
        ) : null}

        {colorData?.vibrant?.comp ? (
          <div
            className={swatchStyles.swatch}
            style={{
              backgroundColor: colorData?.vibrant?.comp?.background,
              color: colorData?.vibrant?.comp?.foreground
            }}>
            {colorData?.vibrant?.comp?.ratio}
          </div>
        ) : null}
      </div>
    </>
  );

  return (
    <div>
      {slug ? (
        <>
          <Link as={`/posts/${slug}`} href="/posts/[slug]">
            <a aria-label={title}>{img}</a>
          </Link>
          {swatchOutput}
        </>
      ) : (
        <>
          {img}
          {swatchOutput}
        </>
      )}
    </div>
  );
}
