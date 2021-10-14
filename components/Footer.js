import Link from "next/link";
import { useRouter } from "next/router";

import styles from "components/Footer.module.css";

export default function Footer() {
  const router = useRouter();
  return router.pathname !== "/privacy-policy" ? (
    <footer className={styles.footer}>
      <Link href="/privacy-policy">
        <a className={styles.footerLink}>Privacy policy</a>
      </Link>
    </footer>
  ) : null;
}
