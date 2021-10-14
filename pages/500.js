import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

import styles from "pages/styles/staticPage.module.css";

// See: https://nextjs.org/docs/advanced-features/custom-error-page

export default function Custom500() {
  return (
    <Layout title="500 error" description="A server-side error occurred">
      <div className={styles.page}>
        <PageTitle>500 error</PageTitle>
        <div className={styles.pageInner}>
          <h2 style={{ textAlign: "center" }}>A server-side error occurred.</h2>
        </div>
      </div>
    </Layout>
  );
}
