import Head from "next/head";
import { SITE_TITLE } from "lib/constants";
import Layout from "components/Layout";

// See: https://nextjs.org/docs/advanced-features/custom-error-page

export default function Custom500() {
  return (
    <Layout>
      <Head>
        <title>500 | {SITE_TITLE}</title>
      </Head>
      <h1>500 - Server-side error occurred</h1>
    </Layout>
  );
}
