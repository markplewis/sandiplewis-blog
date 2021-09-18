import { useCurrentUser } from "lib/sanity";
import styles from "components/PreviewMessage.module.css";

export default function PreviewMessage() {
  const { data } = useCurrentUser();
  return data ? <div className={styles.previewMessage}>Preview mode</div> : null;
}
