import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

import commonStyles from "pages/styles/common.module.css";
import styles from "pages/styles/staticPage.module.css";

// See: https://nextjs.org/docs/advanced-features/custom-error-page

export default function Custom500() {
  return (
    <Layout title="500" description="A server-side error occurred">
      <div className={`${commonStyles.page} ${styles.page}`}>
        <PageTitle>500 error</PageTitle>
        <div className={styles.pageInner}>
          <h2 style={{ textAlign: "center" }}>A server-side error occurred.</h2>
        </div>
      </div>
    </Layout>
  );
}
