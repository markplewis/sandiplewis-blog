import Head from "next/head";
import { SITE_TITLE } from "lib/constants";
import Layout from "components/Layout";

import "pages/styles/error.module.css";

// See: https://nextjs.org/docs/advanced-features/custom-error-page

export default function Custom500() {
  return (
    <Layout layoutClass="l-error">
      <Head>
        <title>500 | {SITE_TITLE}</title>
      </Head>
      <h1>500 - Server-side error occurred</h1>
    </Layout>
  );
}
