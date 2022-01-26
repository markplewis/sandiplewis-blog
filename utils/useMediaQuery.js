import { useState, useEffect } from "react";

// Imspired by: https://www.netlify.com/blog/2020/12/05/building-a-custom-react-media-query-hook-for-more-responsive-apps/

export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    // For Safari 13 and below
    const isModernBrowser = window.matchMedia("all").addEventListener;
    if (!isModernBrowser) {
      media.addListener(listener);
      return () => media.removeListener(listener);
    } else {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, [matches, query]);

  return matches;
}
