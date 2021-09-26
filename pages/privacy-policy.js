import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

import commonStyles from "pages/styles/common.module.css";

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
      <div className={commonStyles.page}>
        <PageTitle>Privacy Policy</PageTitle>
        <p>Last updated: September 25, 2021</p>
        <p>
          This website does not collect or store the personal data of its users. It doesn’t use
          cookies, analytics tools (e.g. Google Analytics), social media share buttons, nor any
          other method to track the behaviour or locations of its users.
        </p>
        <h2>Social media share buttons</h2>
        <p>
          The social media share buttons on this website are simple, direct links to their
          respective social media platforms (i.e. Twitter and Facebook), so no third-party tracking
          code is added to the page by these companies.
        </p>
        <h2>Contact form</h2>
        <p>
          This website’s contact form sends an email immediately upon submission and the submitted
          data is not retained afterward.
        </p>
        <p>
          The “anti-robot verification” feature of this website’s contact form is a spam-prevention
          service provided by <a href="https://friendlycaptcha.com/">Friendly Captcha</a>. This
          service does not collect any information about the users of the websites’ on which it
          operates. Instead, it generates a unique cryptographic puzzle for the users’ computer to
          solve. This is known as a “proof-of-work” challenge.
        </p>
      </div>
    </Layout>
  );
}

// macOS curly quotes key bindings: https://mybyways.com/blog/visual-studio-code-key-bindings-for-curly-quotes
