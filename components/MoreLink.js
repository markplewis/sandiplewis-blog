import Link from "next/link";
import styles from "components/MoreLink.module.css";
import { colorTokens as colors } from "utils/designTokens/colors";

export default function MoreLink({
  as,
  href,
  text,
  align = "end",
  fgColor = colors?.white?.hsl,
  bgColor = colors?.black?.hsl
}) {
  let alignClass;
  switch (align) {
    case "start":
      alignClass = styles.moreLinkContainerLeft;
      break;
    case "center":
      alignClass = styles.moreLinkContainerCenter;
      break;
    case "end":
    default:
      alignClass = styles.moreLinkContainerRight;
      break;
  }
  return (
    <div className={`${styles.moreLinkContainer} ${alignClass}`}>
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
