import Link from "next/link";

import styles from "components/ShareTools.module.css";

export default function ShareTools({ position }) {
  let positionClass = null;
  switch (position) {
    case "above":
      positionClass = styles.shareToolsAbove;
      break;
    case "below":
      positionClass = styles.shareToolsBelow;
      break;
    case "vertical":
      positionClass = styles.shareToolsVertical;
      break;
  }
  return (
    <div className={`${styles.shareTools} ${positionClass}`}>
      <Link href="https://www.facebook.com">
        <a className={styles.shareTool} aria-label="Share on Facebook">
          <svg role="img" aria-hidden={true} focusable={false} pointerEvents="none">
            <use xlinkHref="#icon-facebook" />
          </svg>
        </a>
      </Link>
      <Link href="https://www.twitter.com">
        <a className={styles.shareTool} aria-label="Share on Twitter">
          <svg role="img" aria-hidden={true} focusable={false} pointerEvents="none">
            <use xlinkHref="#icon-twitter" />
          </svg>
        </a>
      </Link>
      <Link href="mailto:someone@example.com">
        <a className={styles.shareTool} aria-label="Share via email">
          <svg role="img" aria-hidden={true} focusable={false} pointerEvents="none">
            <use xlinkHref="#icon-email" />
          </svg>
        </a>
      </Link>
    </div>
  );
}
