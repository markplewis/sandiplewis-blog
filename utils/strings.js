const urlRegex = /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi;

// Convert: `by Alex Kozlov · url: https://www.pexels.com/@alex-kozlov-3442124`
// to this: `by Alex Kozlov · <a href="https://www.pexels.com/@alex-kozlov-3442124">Pexels</a>`

export function processCreditLine(creditLine) {
  let credit = creditLine;
  if (creditLine && creditLine.includes("pexels.com") && urlRegex.test(creditLine)) {
    credit = creditLine
      .replace(urlRegex, match => `<a href="${match}">Pexels</a>`)
      .replace("url:", "")
      .replace("by ", "");
  }
  return credit;
}
