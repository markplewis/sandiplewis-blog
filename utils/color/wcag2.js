/**
 * TODO
 * Implementing a color contrast checker: https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o
 * Converting fractions to ratios: https://sciencing.com/convert-fraction-ratio-8430467.html
 * @param {Number} lum1 - Luminence 1
 * @param {Number} lum2 - Luminence 2
 * @returns {Number} Color contrast (float)
 */
export function contrastWCAG2(lum1, lum2) {
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

// Progressively more strict
const contrastRatios = [
  3, // 3:1 (AA large text)
  4.5, // 4.5:1 (AA small text and AAA large text)
  7 // 7:1 (AAA small text)
];

/**
 * TODO
 * @param {Number} contrast - Color contrast (float)
 * @param {String} requirement
 * @returns {Boolean} Whether it has sufficient contrast
 */
export function contrastTestWCAG2(contrast, level = 2) {
  return contrast >= contrastRatios[level];
}
