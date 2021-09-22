import Head from "next/head";
import { SITE_TITLE } from "lib/constants";
import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

import commonStyles from "pages/styles/common.module.css";

export default function PrivacyPolicy() {
  return (
    <Layout description="Privacy policy">
      <Head>
        <title>Privacy policy | {SITE_TITLE}</title>
      </Head>
      <div className={commonStyles.page}>
        <PageTitle>Privacy policy</PageTitle>
        <p>
          This website includes a Facebook share button on some of its pages. This button, and the
          Facebook app that it’s connected to, do not collect any personal data about its users.
        </p>
        {/* TODO: add privacy policy for Google Analytics */}
      </div>
    </Layout>
  );
}
