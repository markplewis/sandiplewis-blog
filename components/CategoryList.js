import Link from "next/link";

import styles from "components/CategoryList.module.css";

export default function CategoryList({ categories, themed = false, centered = false }) {
  return categories && categories.length ? (
    <div className={styles.categories}>
      <ul className={`${styles.categoryList} ${centered && styles.categoryListCentered}`}>
        {categories.map(({ slug, title }) => (
          <li key={slug}>
            <Link as={`/categories/${slug}`} href="/categories/[slug]">
              <a className={`${styles.category} ${themed && styles.categoryThemed}`}>{title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
}
