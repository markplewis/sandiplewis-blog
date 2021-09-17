import { useEffect } from "react";
import { canUseDOM } from "utils/detect";

const defaultTarget = canUseDOM ? window : null;

/**
 * Hook for addEventListener. More declarative way of listening for events.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * @param {String} type - A case-sensitive string representing the event type to listen for.
 * @param {Function} listener - Event listener callback function.
 * @param {Object} [options={}] - An options object specifies characteristics about the event listener.
 * @param {Object} [target=window] - Event target to listen for events from.
 */
export default function useEvent(type, listener, options = {}, target = defaultTarget) {
  useEffect(() => {
    if (!type || !listener || !target) {
      return;
    }
    target.addEventListener(type, listener, options);
    return () => {
      target.removeEventListener(type, listener, options);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listener, type, target, JSON.stringify(options)]);
}
