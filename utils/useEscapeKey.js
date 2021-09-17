import { useMemo } from "react";
import { canUseDOM } from "utils/detect";
import useEvent from "utils/useEvent";

const ESCAPE_CODE = "Escape";
const ESCAPE_KEY_CODE = 27;

/**
 * Detect if user presses the ESC key.
 * @see https://usehooks.com/useOnClickOutside/
 * @param {Function} callback
 */
export default function useEscapeKey(callback) {
  const [handleKeypress, target] = useMemo(() => {
    if (!canUseDOM || !window || !window.document || !callback) {
      return [];
    }
    const d = window.document;
    const listener = e => {
      const code = e.code || e.keyCode;
      return (code === ESCAPE_CODE || code === ESCAPE_KEY_CODE) && callback(e);
    };
    return [listener, d];
  }, [callback]);

  useEvent("keydown", handleKeypress, {}, target);
}
