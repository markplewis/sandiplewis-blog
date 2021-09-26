import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useApp } from "utils/useApp";
import useMediaQuery from "utils/useMediaQuery";
import { rem } from "utils/units";
import useEscapeKey from "utils/useEscapeKey";
import useOnClickOutside from "utils/useOnClickOutside";
import useWindowSize from "utils/useWindowSize";

import styles from "components/Header.module.css";

export default function Header({ children }) {
  const { dispatchApp } = useApp();
  const router = useRouter();
  const pathName = router.pathname;
  const active = styles.navItemActive;
  const isMedium = useMediaQuery(`(min-width: ${rem(820)})`);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHidden, setMenuHidden] = useState(true);
  const menuButtonRef = useRef();
  const menuRef = useRef();
  const headerRef = useRef();
  const [headerHeight, setHeaderHeight] = useState(0);

  // Adjust menu height and position to accommodate header
  const menuInlineStyles = {
    top: `${rem(headerHeight)}`,
    height: `calc(100% - ${rem(headerHeight)})`
  };

  // Measure header height
  const adjustMenuHeight = useCallback(() => {
    const header = headerRef.current;
    header && setHeaderHeight(header.offsetHeight);
  }, []);

  useWindowSize(adjustMenuHeight, 500);

  const setContentHidden = useCallback(
    hidden => {
      dispatchApp({
        type: "UPDATE",
        payload: {
          bodyContentHidden: hidden
        }
      });
    },
    [dispatchApp]
  );

  // Lock scrolling while menu is open
  useEffect(() => {
    dispatchApp({
      type: "UPDATE",
      payload: {
        bodyScrollLocked: menuOpen && !isMedium
      }
    });
  }, [dispatchApp, isMedium, menuOpen]);

  const openMenu = () => {
    adjustMenuHeight();
    setMenuOpen(true);
    setMenuHidden(false);
  };

  const closeMenu = e => {
    setMenuOpen(false);
    setContentHidden(false);

    if (e && e.type !== "keydown") {
      // Don't focus button when user clicked/tapped outside of menu to close it
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

  // Close menu when user presses Escape key
  useEscapeKey(closeMenu);

  // Close menu when user clicks/taps outside of it
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
        <li
          className={`${styles.navItem} ${
            pathName.startsWith("/writing") ||
            pathName.startsWith("/novels") ||
            pathName.startsWith("/short-stories")
              ? active
              : ""
          }`}>
          <Link href="/writing">
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
        <li className={styles.navItem}>
          <Link href="https://twitter.com/SandiPlewis">
            <a
              className={styles.shareButton}
              aria-label="Follow Sandi on Twitter"
              target="_blank"
              rel="noopener noreferrer">
              {isMedium && <span>Follow</span>}
              <svg role="img" aria-hidden={true} focusable={false} pointerEvents="none">
                <use xlinkHref="#icon-twitter" />
              </svg>
              {!isMedium && <span>Follow Sandi on Twitter</span>}
            </a>
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
        } else {
          setContentHidden(true);
        }
      }}>
      {navLinks}
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
        <p className={styles.name}>
          <Link href="/">
            <a className={styles.nameLink}>Sandi Plewis</a>
          </Link>
        </p>
        <p className={styles.title}>Author/editor</p>
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
