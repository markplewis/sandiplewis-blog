import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

import commonStyles from "pages/styles/common.module.css";

// For Facebook: "This policy must comply with applicable law and regulations and must accurately and clearly explain what data you are Processing, how you are Processing it, the purposes for which you are Processing it, and how Users may request deletion of that data." - https://developers.facebook.com/terms

export default function PrivacyPolicy() {
  return (
    <Layout title="Privacy policy" description="Privacy policy">
      <div className={commonStyles.page}>
        <PageTitle>Privacy policy</PageTitle>
        <p>
          This website includes a Facebook share button on some of its pages. This button, and the
          Facebook app that it’s connected to, do not collect any personal data about its users.
        </p>
        {/* TODO: add privacy policy for Google Analytics */}
      </div>
    </Layout>
  );
}
