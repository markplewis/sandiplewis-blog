import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import useMediaQuery from "utils/useMediaQuery";
import { rem } from "utils/units";
import useEscapeKey from "utils/useEscapeKey";
import useOnClickOutside from "utils/useOnClickOutside";
import useWindowSize from "utils/useWindowSize";

import styles from "components/Header.module.css";

export default function Header({ children }) {
  const router = useRouter();
  const pathName = router.pathname;
  const active = styles.navItemActive;
  const isMedium = useMediaQuery(`(min-width: ${rem(768)})`);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHidden, setMenuHidden] = useState(true);
  const menuButtonRef = useRef();
  const menuRef = useRef();
  const headerRef = useRef();
  const [headerHeight, setHeaderHeight] = useState(0);

  // Adjust the menu panel's position and height to accommodate the header
  const menuInlineStyles = {
    top: `${rem(headerHeight)}`,
    height: `calc(100% - ${rem(headerHeight)})`
  };

  // Measure header height
  const adjustMenuHeight = useCallback(() => {
    // Adjust position of menu
    const header = headerRef.current;
    header && setHeaderHeight(header.offsetHeight);
  }, []);

  useWindowSize(adjustMenuHeight, 500);

  // Lock scrolling when menu is open
  useEffect(() => {
    document.body.classList[menuOpen && !isMedium ? "add" : "remove"]("u-no-scroll--not-fixed");
  }, [isMedium, menuOpen]);

  const openMenu = () => {
    adjustMenuHeight();
    setMenuOpen(true);
    setMenuHidden(false);
  };

  const closeMenu = e => {
    setMenuOpen(false);
    if (e && e.type !== "keydown") {
      // Don't focus button when user clicked outside menu
      return;
    }
    const menuButton = menuButtonRef.current;
    menuButton?.focus();
  };

  const handleMenuClickOutside = e => {
    const menuButton = menuButtonRef.current;
    if (e && menuButton?.contains(e.target)) {
      return;
    }
    closeMenu(e);
  };

  // Close the menu panel when the user presses the Escape key
  useEscapeKey(closeMenu);

  // Close the menu panel when the user clicks somewhere outside of it
  useOnClickOutside(menuRef, handleMenuClickOutside);

  const handleMenuButtonClick = () => {
    !menuOpen ? openMenu() : closeMenu();
  };

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

  const navMenu = (
    <div
      id="nav-menu"
      ref={menuRef}
      className={`${styles.navMenu} ${menuOpen ? styles.navMenuRevealing : styles.navMenuHiding}`}
      style={menuInlineStyles}
      hidden={menuHidden}
      onAnimationEnd={() => {
        if (!menuOpen) {
          setMenuHidden(true);
        }
      }}>
      {navLinks}
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean quis nibh sit amet ligula
        blandit interdum. Aenean ornare iaculis metus. Nunc augue sapien, placerat id purus ut,
        posuere pretium sem. Aenean nec ultricies purus. Ut odio elit, facilisis eu faucibus ac,
        rutrum nec est. Ut sit amet mollis arcu. Phasellus vel mi risus. Proin blandit eu orci a
        rhoncus. Vestibulum sit amet imperdiet neque, vel mollis ante.
      </p>
      <p>
        Vivamus massa lectus, placerat a orci et, pellentesque mattis odio. Aenean elit nisl,
        consequat gravida congue id, rhoncus vitae nisi. Mauris finibus purus quis laoreet varius.
        Pellentesque pulvinar est eu lorem bibendum suscipit. Cras at odio ipsum. Vivamus tempor
        sapien aliquet, egestas sem eu, suscipit tellus. Maecenas nibh nisl, suscipit vel orci quis,
        fermentum dapibus dolor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
        posuere cubilia curae; Integer nec elit nisi.
      </p>
      <p>
        Etiam venenatis, tortor ac mollis molestie, elit ante accumsan ex, non accumsan nisi enim
        eget massa. Nullam bibendum erat quis rutrum dignissim. Donec congue, nulla vitae tincidunt
        tempor, ipsum ipsum molestie velit, a aliquet erat augue tempus ligula. Duis hendrerit, ex
        ac venenatis commodo, turpis est laoreet ex, nec maximus ante orci non erat. Praesent
        mollis, ligula sit amet gravida scelerisque, leo magna convallis quam, at mollis eros nisi
        vitae ligula. Praesent sed sodales dolor, maximus blandit nibh. Aenean rutrum nisl ipsum,
        volutpat egestas felis laoreet eu. Sed eleifend mauris eget quam ultricies, eu tincidunt
        felis dignissim. Nullam sit amet hendrerit odio. Ut laoreet dapibus ipsum, in consequat orci
        consequat sed. Praesent iaculis, elit a ultrices sodales, magna nibh scelerisque augue, sed
        eleifend nibh mauris sit amet ante. Pellentesque at felis lacus. Nunc quis volutpat tellus.
        Proin sit amet porta arcu. Proin id rhoncus elit. Phasellus vel viverra felis.
      </p>
    </div>
  );

  const navMenuButton = (
    <button
      type="button"
      id="nav-menu-button"
      ref={menuButtonRef}
      onClick={handleMenuButtonClick}
      className={`${styles.navMenuButton} u-button-appearance-none`}
      aria-label={`${menuOpen ? "Close" : "Open"} navigation menu`}
      aria-controls="nav-menu"
      aria-expanded={menuOpen}>
      <svg role="img" aria-hidden={true} focusable={false} pointerEvents="none">
        <use xlinkHref="#icon-menu" />
      </svg>
    </button>
  );

  return (
    <header className={styles.header} ref={headerRef}>
      {children}
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
