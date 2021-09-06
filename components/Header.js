import Link from "next/link";
import { useRouter } from "next/router";

import useMediaQuery from "utils/useMediaQuery";
import { rem } from "utils/units";

import styles from "components/Header.module.css";

export default function Header() {
  const router = useRouter();
  const pathName = router.pathname;
  const active = styles.navItemActive;
  const isMedium = useMediaQuery(`(min-width: ${rem(768)})`);

  const navMenuButton = (
    <button
      type="button"
      id="nav-menu-button"
      className={`${styles.navMenuButton} u-button-appearance-none`}
      aria-label="Open navigation menu"
      aria-controls="nav-menu"
      aria-expanded={false}>
      <svg role="img" aria-hidden={true} focusable={false} pointerEvents="none">
        <use xlinkHref="#icon-menu" />
      </svg>
    </button>
  );

  const navMenu = <div id="nav-menu" className={styles.navMenu}></div>;

  const navLinks = (
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
  );

  return (
    <header className={styles.header}>
      <div className={styles.nameAndTitle}>
        <h1 className={styles.name}>Sandi Plewis</h1>
        <h2 className={styles.title}>Author/editor</h2>
      </div>
      {isMedium ? (
        navLinks
      ) : (
        <>
          {navMenuButton}
          {navMenu}
        </>
      )}
    </header>
  );
}
