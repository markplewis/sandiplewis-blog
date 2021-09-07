import Head from "next/head";
import { SITE_TITLE } from "lib/constants";
import ContactForm from "components/ContactForm";
import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

import commonStyles from "pages/styles/common.module.css";
// import "pages/styles/contact.module.css";

export default function Contact() {
  return (
    <Layout>
      <Head>
        <title>Contact | {SITE_TITLE}</title>
      </Head>
      <div className={commonStyles.page}>
        <PageTitle>Contact</PageTitle>
        <ContactForm />
      </div>
    </Layout>
  );
}
