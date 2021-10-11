export const SITE_TITLE = "Sandi Plewis";
export const DEFAULT_META_DESCRIPTION = "Sandi Plewis' personal website and blog";

const environments = {
  production: "https://www.sandiplewis.com",
  development: "https://dev.sandiplewis.com",
  local: "http://localhost:3000"
};

const envProd =
  process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SANITY_DATASET === "production";

const envDev =
  process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SANITY_DATASET === "development";

const envLocal = !envProd && !envDev;

export const BASE_URL = envLocal
  ? environments.local
  : envDev
  ? environments.development
  : environments.production;
