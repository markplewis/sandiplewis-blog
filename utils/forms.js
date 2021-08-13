// Pattern taken from: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
export const emailRegex =
  // eslint-disable-next-line no-useless-escape
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
