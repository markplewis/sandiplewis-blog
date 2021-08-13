import Router from "next/router";
import NProgress from "nprogress";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

// Global styles
import "modern-normalize/modern-normalize.css";
import "nprogress/nprogress.css";
import "styles/global.css";

// https://vpilip.com/next-js-page-loading-indicator-improve-ux-of-next-js-app/
// https://usabilitypost.com/2013/08/19/new-ui-pattern-website-loading-bars/

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

// A custom App component. See: https://nextjs.org/docs/advanced-features/custom-app

function MyApp({ Component, pageProps }) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
      scriptProps={{ async: true, defer: true }}>
      <Component {...pageProps} />
    </GoogleReCaptchaProvider>
  );
}

export default MyApp;
