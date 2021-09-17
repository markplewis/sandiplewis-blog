import { useMemo, useState } from "react";
import { debounce } from "utils/callback";
import { canUseDOM } from "utils/detect";
import useEvent from "utils/useEvent";

// Ensure that callback param is wrapped in a useCallback() hook
export default function useWindowSize(callback, ms = 300) {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0
  });

  const debouncedResize = useMemo(() => {
    if (!canUseDOM) {
      return;
    }
    const resize = debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      callback();
    }, ms);

    resize();
    return resize;
  }, [callback, ms]);

  useEvent("resize", debouncedResize);

  return windowSize;
}
