import Head from "next/head";
import { SITE_TITLE } from "lib/constants";
import Layout from "components/Layout";

// See: https://nextjs.org/docs/advanced-features/custom-error-page

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>404 | {SITE_TITLE}</title>
      </Head>
      <h1>404 - Page Not Found</h1>
    </Layout>
  );
}
