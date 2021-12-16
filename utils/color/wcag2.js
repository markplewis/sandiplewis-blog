/**
 * TODO
 * Implementing a color contrast checker: https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o
 * Converting fractions to ratios: https://sciencing.com/convert-fraction-ratio-8430467.html
 * @param {Number} lum1 - Luminence 1
 * @param {Number} lum2 - Luminence 2
 * @returns {Number} Colour contrast ratio
 */
export function colorContrastRatio(lum1, lum2) {
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const contrast = (brightest + 0.05) / (darkest + 0.05);
  // Round to 2 decimal places: https://stackoverflow.com/a/11832950/1243086
  return Math.round((contrast + Number.EPSILON) * 100) / 100;

  // const num1 = lum2 > lum1 ? lum1 + 0.05 : lum2 + 0.05;
  // const num2 = lum2 > lum1 ? lum2 + 0.05 : lum1 + 0.05;
  // return {
  //   ratio: `${Math.round((num2 / num1 + Number.EPSILON) * 100) / 100}:${num1 / num1}`,
  //   float: Math.round((num1 / num2 + Number.EPSILON) * 100) / 100
  // };
}

/**
 * AA large text - 3:1
 * @param {Number} num - Colour contrast ratio
 * @returns {Number}
 */
export function colorContrastLargeTextAA(num) {
  return num < 1 / 3; // 0.33
}

/**
 * AA small text - 4.5:1
 * @param {Number} num - Colour contrast ratio
 * @returns {Number}
 */
export function colorContrastSmallTextAA(num) {
  return num < 1 / 4.5; // 0.22
}

/**
 * AAA large text - 4.5:1
 * @param {Number} num - Colour contrast ratio
 * @returns {Number}
 */
export function colorContrastLargeTextAAA(num) {
  return num < 1 / 4.5; // 0.22
}

/**
 * AAA small text - 7:1
 * @param {Number} num - Colour contrast ratio
 * @returns {Number}
 */
export function colorContrastSmallTextAAA(num) {
  return num < 1 / 7; // 0.14
}
