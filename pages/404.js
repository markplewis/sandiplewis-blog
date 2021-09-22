import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

import commonStyles from "pages/styles/common.module.css";

// See: https://nextjs.org/docs/advanced-features/custom-error-page

export default function Custom404() {
  return (
    <Layout title="404" description="This page could not be found">
      <div className={commonStyles.page}>
        <PageTitle>404 - Page Not Found</PageTitle>
      </div>
    </Layout>
  );
}
