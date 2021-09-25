import Link from "next/link";
import { useRouter } from "next/router";

import { BASE_URL } from "lib/constants";

import styles from "components/ShareTools.module.css";

function encodeUrlParams(params = {}) {
  return Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&");
}

export default function ShareTools({ text, position }) {
  const router = useRouter();
  const url = `${BASE_URL}${router.asPath}`;
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
  // TODO: explain this in privacy policy: https://www.tunnelbear.com/blog/why-we-created-our-own-social-media-buttons-on-our-website/

  const twitterURL = `https://twitter.com/share?${encodeUrlParams({ url, text })}`;
  // const facebookURL = `https://www.facebook.com/dialog/feed/?${encodeUrlParams({
  //   // https://developers.facebook.com/docs/sharing/reference/share-dialog
  //   app_id: "656375675249762",
  //   // display: "popup",
  //   // href: url,
  //   link: url,
  //   redirect_uri: url
  // })}`;
  const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  const emailURL = `mailto:?body=From SandiPlewis.com: ${text} - ${url}`;

  return (
    <div className={`${styles.shareTools} ${positionClass}`}>
      <Link href={twitterURL}>
        <a
          className={styles.shareTool}
          aria-label="Share on Twitter"
          target="_blank"
          rel="noopener noreferrer">
          <svg role="img" aria-hidden={true} focusable={false} pointerEvents="none">
            <use xlinkHref="#icon-twitter" />
          </svg>
        </a>
      </Link>
      <Link href={facebookURL}>
        <a
          className={styles.shareTool}
          aria-label="Share on Facebook"
          target="_blank"
          rel="noopener noreferrer">
          <svg role="img" aria-hidden={true} focusable={false} pointerEvents="none">
            <use xlinkHref="#icon-facebook" />
          </svg>
        </a>
      </Link>
      <Link href={emailURL}>
        <a
          className={styles.shareTool}
          aria-label="Share via email"
          target="_blank"
          rel="noopener noreferrer">
          <svg role="img" aria-hidden={true} focusable={false} pointerEvents="none">
            <use xlinkHref="#icon-email" />
          </svg>
        </a>
      </Link>
    </div>
  );
}
