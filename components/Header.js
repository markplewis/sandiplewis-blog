import Link from "next/link";
import { useRouter } from "next/router";

import styles from "components/Header.module.css";

export default function Header() {
  const router = useRouter();
  const pathName = router.pathname;
  const active = styles.navItemActive;
  return (
    <header className={styles.header}>
      <h1 className={styles.name}>Sandi Plewis</h1>
      <h2 className={styles.title}>Author/editor</h2>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={`${styles.navItem} ${pathName === "/" ? active : ""}`}>
            <Link href="/">
              <a className={styles.navLink}>Home</a>
            </Link>
          </li>
          <li className={`${styles.navItem} ${pathName.startsWith("/novels") ? active : ""}`}>
            <Link href="/novels">
              <a className={styles.navLink}>Writing</a>
            </Link>
          </li>
          <li className={`${styles.navItem} ${pathName.startsWith("/posts") ? active : ""}`}>
            <Link href="/posts">
              <a className={styles.navLink}>Blog</a>
            </Link>
          </li>
          <li className={`${styles.navItem} ${pathName === "/contact" ? active : ""}`}>
            <Link href="/contact">
              <a className={styles.navLink}>Contact</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
