import Head from "next/head";
import { SITE_TITLE } from "lib/constants";
import ContactForm from "components/ContactForm";
import Layout from "components/Layout";

import "pages/styles/contact.module.css";

export default function Contact() {
  return (
    <Layout layoutClass="l-contact">
      <Head>
        <title>Contact | {SITE_TITLE}</title>
      </Head>
      <h1>Contact</h1>
      <ContactForm />
    </Layout>
  );
}
