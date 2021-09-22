import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

import commonStyles from "pages/styles/common.module.css";

// See: https://nextjs.org/docs/advanced-features/custom-error-page

export default function Custom500() {
  return (
    <Layout title="500" description="A server-side error occurred">
      <div className={commonStyles.page}>
        <PageTitle>500 - Server-side error occurred</PageTitle>
      </div>
    </Layout>
  );
}
