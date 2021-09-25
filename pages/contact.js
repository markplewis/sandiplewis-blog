import ContactForm from "components/ContactForm";
import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

import commonStyles from "pages/styles/common.module.css";

export default function Contact() {
  return (
    <Layout title="Contact" description="Contact Sandi Plewis">
      <div className={commonStyles.page}>
        <PageTitle>Contact</PageTitle>
        <ContactForm />
      </div>
    </Layout>
  );
}
