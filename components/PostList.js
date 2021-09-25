import Image from "next/image";
import Link from "next/link";

import { urlFor } from "lib/sanity";

import { rem } from "utils/units";

import styles from "components/PostList.module.css";

export default function PostList({
  posts,
  path = "posts",
  size = "small",
  orientation = "landscape"
}) {
  // 9:14 aspect ratio for portrait, 3:2 for landscape
  const imageWidth = size === "small" ? 83 : 120;
  let imageHeight;
  if (orientation === "portrait") {
    imageHeight = size === "small" ? 129 : 187;
  } else {
    imageHeight = size === "small" ? 55 : 80;
  }
  return (
    <ul className={styles.postList}>
      {posts.map(post => (
        <li className={styles.postItem} key={post?._id}>
          <Link as={`/${path}/${post?.slug}`} href={`/${path}/[slug]`}>
            <a className={styles.postLink}>
              {post?.image ? (
                <div className={styles.postImage} style={{ width: rem(imageWidth) }}>
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
                <h3 className={styles.postTitle}>{post?.title}</h3>
                <p className={styles.postDescription}>{post?.description}</p>
              </div>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
}
