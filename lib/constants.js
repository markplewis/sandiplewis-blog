export const SITE_TITLE = "Sandi Plewis";
export const DEFAULT_META_DESCRIPTION = "Sandi Plewis' personal website and blog";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";
