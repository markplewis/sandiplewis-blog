import Link from "next/link";
import styles from "components/MoreLink.module.css";
import { colors } from "utils/color";

const { baseFontColor } = colors;

export default function MoreLink({ as, href, text, fgColor = "#fff", bgColor = baseFontColor }) {
  return (
    <div className={styles.moreLinkContainer}>
      <Link as={as} href={href}>
        <a className={styles.moreLink} style={{ backgroundColor: bgColor, color: fgColor }}>
          <span>{text}</span>
          <svg
            className={styles.moreLinkSVG}
            fill={fgColor}
            role="img"
            pointerEvents="none"
            focusable={false}
            aria-hidden={true}>
            <use xlinkHref="#icon-arrow-right" />
          </svg>
        </a>
      </Link>
    </div>
  );
}
