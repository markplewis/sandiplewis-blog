// See: https://www.sanity.io/guides/portable-text-internal-and-external-links
export const internalLinkSerializer = {
  internalLink: ({ mark, children }) => {
    const { slug = {}, type } = mark;
    let path;
    switch (type) {
      case "post":
        path = "posts";
        break;
      case "novel":
        path = "novels";
        break;
      case "shortStory":
        path = "short-stories";
        break;
    }
    const href = `/${path}/${slug.current}`;
    return <a href={href}>{children}</a>;
  }
};
