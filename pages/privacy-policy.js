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

// TODO: explain this in privacy policy: https://www.tunnelbear.com/blog/why-we-created-our-own-social-media-buttons-on-our-website/

export default function PrivacyPolicy() {
  return (
    <Layout title="Privacy policy" description="Privacy policy">
      <div className={styles.page}>
        <PageTitle>Privacy Policy</PageTitle>

        <div className={styles.pageInner}>
          <p>Last updated: November 1, 2021</p>
          <p>
            This website does not collect or store any personally identifiable information (PII)
            about its users. It uses a privacy-friendly Google Analytics alternative called{" "}
            <a href="https://plausible.io/">Plausible</a> to collect basic, anonymized traffic data.
            This helps us better understand which blog posts are receiving the most views, etc.
          </p>
          <p>
            The social media share buttons on this website are simple, direct links to their
            respective social media platforms (i.e. Twitter and Facebook). Consequently, no
            third-party tracking code is added to the page by these companies or their affiliates.
          </p>
          <p>
            This website’s contact form sends an email immediately upon submission and the submitted
            data is not retained thereafter. Its “anti-robot verification” feature is a
            spam-prevention service provided by{" "}
            <a href="https://friendlycaptcha.com/">Friendly Captcha</a>. This service does not
            collect any information about its users.
          </p>
        </div>
      </div>
    </Layout>
  );
}

// macOS curly quotes key bindings: https://mybyways.com/blog/visual-studio-code-key-bindings-for-curly-quotes
// TODO: how to make VSCode automatically insert these, or maybe format them via an extension?
