import Head from "next/head";
import { SITE_TITLE } from "lib/constants";
import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

import commonStyles from "pages/styles/common.module.css";
// import "pages/styles/error.module.css";

// See: https://nextjs.org/docs/advanced-features/custom-error-page

export default function Custom404() {
  return (
    <Layout description="This page could not be found">
      <Head>
        <title>404 | {SITE_TITLE}</title>
      </Head>
      <div className={commonStyles.page}>
        <PageTitle>404 - Page Not Found</PageTitle>
      </div>
    </Layout>
  );
}
