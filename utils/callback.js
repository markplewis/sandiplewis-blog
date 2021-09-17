/**
 * Creates a throttled function that gets invoked once per specified ms.
 * @example const debouncedHanlder = useMemo(() => debounce(handler, ms), [handler, ms]);
 * @param {Function} fn - the function to throttle
 * @param {Number} ms - the number of milliseconds to throttle invocations to
 * @returns {Function}
 */
export function debounce(fn, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      timer = null;
      fn.apply(this, args);
    }, ms);
  };
}
