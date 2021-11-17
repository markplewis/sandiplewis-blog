import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

import styles from "pages/styles/staticPage.module.css";

// Information:
// - https://www.gravityforms.com/privacy-policy-wordpress-website/
// - https://termly.io/resources/articles/blog-privacy-policy/

// For Facebook: "This policy must comply with applicable law and regulations and must accurately
// and clearly explain what data you are Processing, how you are Processing it, the purposes for
// which you are Processing it, and how Users may request deletion of that data."
// - https://developers.facebook.com/terms

export default function PrivacyPolicy() {
  return (
    <Layout title="Privacy policy" description="Privacy policy">
      <div className={styles.page}>
        <PageTitle>Privacy Policy</PageTitle>

        <div className={styles.pageInner}>
          <p>Last updated: November 1, 2021</p>
          <p>
            This website uses a privacy-friendly Google Analytics alternative called{" "}
            <a href="https://plausible.io/">Plausible</a> to collect anonymized traffic data, in
            order to help us better understand which pages are receiving the most views, etc. This
            website does not collect any personally identifiable information (PII) about its users.
          </p>
          <p>
            The social media share buttons on this website are simple, direct links to their
            respective platforms (i.e. Twitter and Facebook). Consequently, no third-party tracking
            code is added to the page by these companies or their affiliates.
          </p>
          <p>
            This website’s contact form sends an email immediately upon submission and the submitted
            data is not retained thereafter. Its “anti-robot verification” feature is a
            spam-prevention service provided by{" "}
            <a href="https://friendlycaptcha.com/">Friendly Captcha</a>, which does not collect any
            information about its users.
          </p>
        </div>
      </div>
    </Layout>
  );
}
