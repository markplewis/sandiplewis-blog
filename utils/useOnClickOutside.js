import { useMemo } from "react";
import { canUseDOM } from "utils/detect";
import useEvent from "utils/useEvent";

/**
 * Detect if user clicks outside of an element.
 * @see https://usehooks.com/useOnClickOutside/
 * @param {Object} ref
 * @param {Function} handler
 */
export default function useOnClickOutside(ref, handler) {
  const [handleClick, target] = useMemo(
    () => {
      if (!canUseDOM || !window || !window.document || !handler) {
        return [];
      }
      const d = window.document;
      const listener = e => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(e.target)) {
          return;
        }
        handler(e);
      };
      return [listener, d];
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );

  useEvent("mousedown", handleClick, {}, target);
  useEvent("touchstart", handleClick, {}, target);
}
