import { useApp } from "utils/useApp";

import styles from "components/SkipLink.module.css";

// According to WebAIM.org: "Some browsers do not fully support in-page links. While they
// may visually shift focus to the location of the target or named anchor for the "skip"
// link, they do not actually set keyboard focus to this location. These bugs can
// potentially be addressed by using JavaScript to set focus to the target element."
// See: https://www.bignerdranch.com/blog/web-accessibility-skip-navigation-links/
// Although it looks like the bug has been fixed in most modern browsers, it seems that
// we'll still need to have this in place for some browsers (e.g., Firefox).

export default function SkipLink() {
  const { app } = useApp();
  const skipLinkTargetRef = app.skipLinkTargetRef;
  return !app.bodyContentHidden ? (
    <a
      className={styles.skipLink}
      href="#skip-link-target"
      onClick={e => {
        e.preventDefault();
        skipLinkTargetRef?.current?.focus();
      }}>
      Skip to main content
    </a>
  ) : null;
}
