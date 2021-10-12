import Image from "next/image";
import Link from "next/link";

import { urlFor } from "lib/sanity";

import { rem } from "utils/units";
import useMediaQuery from "utils/useMediaQuery";

import Date from "components/Date";
import styles from "components/PostList.module.css";

const sizes = {
  mobile: {
    width: 240,
    // Possible heights
    // 3:2 aspect ratio for landscape, 9:14 for portrait
    landscape: 160,
    portrait: 374
  },
  small: {
    width: 83,
    landscape: 55,
    portrait: 129
  },
  large: {
    width: 120,
    landscape: 80,
    portrait: 187
  }
};

export default function PostList({
  posts,
  path = "posts",
  size = "small", // "small" or "large"
  orientation = "landscape", // "landscape" or "portrait"
  showDates = false,
  showBackground = false
}) {
  const isMinWidth = useMediaQuery(`(min-width: ${rem(480)})`);
  const imageSize = !isMinWidth ? sizes.mobile : sizes[size];
  const imageWidth = imageSize.width;
  const imageHeight = orientation === "square" ? imageWidth : imageSize[orientation];
  return (
    <ul className={`${styles.postList} ${showBackground ? styles.postListPadded : ""}`}>
      {posts.map(post => (
        <li key={`${path}-${post?._id}-${post?.slug}`}>
          <Link as={`/${path}/${post?.slug}`} href={`/${path}/[slug]`}>
            <a className={styles.postLink}>
              {post?.image ? (
                <div className={styles.postImage} style={{ maxWidth: rem(imageWidth) }}>
                  <Image
                    src={urlFor(post?.image)
                      .width(imageWidth * 2)
                      .height(imageHeight * 2)
                      .url()}
                    width={imageWidth}
                    height={imageHeight}
                    sizes={`(max-width: 800px) 100vw, ${imageWidth}px`}
                    layout="responsive"
                    alt={post?.image?.alt}
                    placeholder="blur"
                    // Data URL generated here: https://png-pixel.com/
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
                  />
                </div>
              ) : null}
              <div className={styles.postInfo}>
                {/* TODO: make this component work for both posts and authors */}
                <h3 className={styles.postTitle}>{post?.title || post?.name}</h3>

                {showDates && post?.date && (
                  <p className={styles.postDate}>
                    <Date dateString={post?.date} />
                  </p>
                )}
                {post?.description && <p className={styles.postDescription}>{post?.description}</p>}
              </div>
            </a>
          </Link>
        </li>
      ))}
      {/* Hack to keep cards properly aligned on `/writing` page,
      when viewport is between `1322px` and `1349px` wide */}
      {/* {posts.length < 2 && <li aria-hidden="true"></li>} */}
    </ul>
  );
}
