import Image from "next/image";
import Link from "next/link";
import { urlFor } from "lib/sanity";

// https://www.sanity.io/docs/presenting-images
// https://nextjs.org/docs/basic-features/image-optimization
// https://nextjs.org/docs/api-reference/next/image

export default function CoverImage({
  className,
  title,
  image,
  slug = null,
  width = 1240,
  height = 540
}) {
  // See: https://nextjs.org/docs/api-reference/next/image
  // Can't produce <picture> elements (no art direction)
  const img = (
    <>
      {image ? (
        <Image
          src={urlFor(image).width(width).height(height).url()}
          width={width}
          height={height}
          sizes="(max-width: 800px) 100vw, 800px"
          layout="responsive"
          alt={image?.alt}
          placeholder="blur"
          // Data URL generated here: https://png-pixel.com/
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
        />
      ) : null}
    </>
  );

  return (
    <div className={className}>
      {slug ? (
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          <a aria-label={title}>{img}</a>
        </Link>
      ) : (
        <>{img}</>
      )}
    </div>
  );
}
