import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

import styles from "pages/styles/staticPage.module.css";

// See: https://nextjs.org/docs/advanced-features/custom-error-page

export default function Custom404() {
  return (
    <Layout title="404 error" description="The page you are looking for could not be found">
      <div className={styles.page}>
        <PageTitle>404 error</PageTitle>
        <div className={styles.pageInner}>
          <h2 style={{ textAlign: "center" }}>The page you are looking for could not be found.</h2>
        </div>
      </div>
    </Layout>
  );
}
