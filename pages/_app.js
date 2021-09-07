import AbortController from "abort-controller";
import Router from "next/router";
import NProgress from "nprogress";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { AppProvider } from "utils/useApp";

// Global styles
import "modern-normalize/modern-normalize.css";
import "nprogress/nprogress.css";
import "styles/base.css";
import "styles/typography.css";

// Polyfill required until mailgun fixes the following issue or Vercel allows us to use Node 15+
// See: https://github.com/mailgun/mailgun-js/issues/101
if (!global.AbortController) {
  global.AbortController = AbortController;
}

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
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </GoogleReCaptchaProvider>
  );
}

export default MyApp;
