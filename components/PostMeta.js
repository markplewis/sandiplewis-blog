import Link from "next/link";

import CategoryList from "components/CategoryList";
import Date from "components/Date";

import styles from "components/PostMeta.module.css";

export default function PostMeta({ creditLine, post, themed = false }) {
  return (
    <div className={`${styles.meta} ${themed && styles.metaThemed}`}>
      <Date className={styles.date} dateString={post?.date} />
      <p>
        <Link as={`/authors/${post?.author?.slug}`} href="/authors/[slug]">
          <a className={styles.author}>{post?.author?.name}</a>
        </Link>
      </p>

      {post?.categories && post.categories.length ? (
        <div className={styles.categories}>
          <p className={styles.categoriesHeading}>
            {post.categories.length > 1 ? "Categories:" : "Category:"}
          </p>
          <CategoryList categories={post?.categories} themed={themed} />
        </div>
      ) : null}

      {/* TODO */}
      {/* {post?.tags && post.tags.length ? (
        <p className={styles.tags}>Tags: {post.tags.map(tag => tag.label).join(", ")}</p>
      ) : null} */}

      {creditLine && (
        <p className={styles.credit} dangerouslySetInnerHTML={{ __html: `Photo: ${creditLine}` }} />
      )}
    </div>
  );
}
