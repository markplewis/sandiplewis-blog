// These values are repeated in `env/constants.js`
const environments = {
  production: "https://www.sandiplewis.com",
  development: "https://dev.sandiplewis.com",
  local: "http://localhost:3000"
};
const projectUrl = environments[process.env.SANITY_STUDIO_BUILD_ENV] || environments.local;

export default function resolveProductionUrl(document) {
  const doc = document.displayed || document;

  if (doc._type === "homePage") {
    return `${projectUrl}/`;
  } else if (doc._type && doc.slug) {
    let type;
    switch (doc._type) {
      case "shortStory":
        type = "short-stories";
        break;
      case "category":
        type = "categories";
        break;
      default:
        type = `${doc._type}s`;
        break;
    }
    return `${projectUrl}/${type}/${doc.slug.current}`;
  }
  return null;
}
