import ContactForm from "components/ContactForm";
import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

import commonStyles from "pages/styles/common.module.css";
import styles from "pages/styles/contact.module.css";

export default function Contact() {
  return (
    <Layout title="Contact Sandi" description="Contact Sandi Plewis">
      <div className={`${commonStyles.page} ${styles.page}`}>
        <PageTitle>Contact Sandi</PageTitle>

        <div className={styles.pageInner}>
          <ContactForm />
        </div>
      </div>
    </Layout>
  );
}
