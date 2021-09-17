import { useState, useEffect } from "react";

/**
 * Hook to debounce a value. If you want to debounce a Function, then use `debounce()`
 * @see https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
 * @param {*} value - to throttle
 * @param {Number} delay - in ms
 * @returns {*}
 */
export default function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Return a cleanup function that will be called every time useEffect is re-called.
      // useEffect will only be re-called if value changes
      // This is how we prevent debouncedValue from changing if value is changed within the delay period.
      // Timeout gets cleared and restarted.
      // If the user is typing within the search box, we don't want the debouncedValue to update
      // until they've stopped typing for more than [value]ms.
      return () => {
        clearTimeout(handler);
      };
    },
    // Only re-call effect if value changes
    // Also adds the "delay" var to inputs array to be able to change that dynamically.
    [delay, value]
  );

  return debouncedValue;
}
