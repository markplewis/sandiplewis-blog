export const SITE_TITLE = "Sandi Plewis";
export const DEFAULT_META_DESCRIPTION = "Sandi Plewis' personal website and blog";

const envProd =
  process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SANITY_DATASET === "production";

const envDev =
  process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SANITY_DATASET === "development";

const envLocal = !envProd && !envDev;

export const BASE_URL = envLocal
  ? "http://localhost:3000"
  : `https://sandiplewis-blog${envDev ? "-dev" : ""}.vercel.app`;
