import { contrastAPCA, contrastTestAPCA } from "utils/color/apca";
import { hexToHSL, HSLToRGB, luminance, RGBToHex } from "utils/color/conversion";
import { contrastWCAG2, contrastTestWCAG2 } from "utils/color/wcag2";

// Whether to use the APCA color contrast algorithm or the older WCAG 2 algorithm
const USE_APCA = true;

/**
 * Returns a color object
 * @param {Number} h - Hue
 * @param {Number} s - Saturation
 * @param {Number} l - Lightness
 * @returns {Object}
 */
export function generateColorFromHSL(h, s, l) {
  const { r, g, b } = HSLToRGB(h, s, l);
  return {
    hex: RGBToHex(r, g, b),
    h,
    s,
    l,
    r,
    g,
    b,
    luminance: luminance(r, g, b)
  };
}

/**
 * Determines whether the given background color has higher contrast when overlaid with black or white foreground text
 * @param {Object} color - Color object
 * @param {Boolean} useAPCA - Whether to use the APCA or WCAG 2 color contrast algorithm
 * @returns {Boolean}
 */
export function darkForegroundHasHigherContrast(color, useAPCA = USE_APCA) {
  // Black foreground
  const blackFgContrast = useAPCA
    ? contrastAPCA("#000000", color.hex)
    : contrastWCAG2(0, color.luminance);

  // White foreground
  const whiteFgContrast = useAPCA
    ? contrastAPCA("#ffffff", color.hex)
    : contrastWCAG2(1, color.luminance);

  // Does black foreground have higher contrast than white foreground?
  return blackFgContrast > whiteFgContrast;
}

/**
 * TODO
 * @param {Object} bgColor - Color object
 * @param {Number} level - Color contrast strictness level, where 0 is the lowest and 2 is the highest
 * @returns {Object} Balanced foreground and background colors, and their relative contrast
 */
function generateColorSet(bgColor, level) {
  const fgShouldBeDark = darkForegroundHasHigherContrast(bgColor);
  // Foreground color will ultimately be a darker version of the background color or pure white
  const fgColor = fgShouldBeDark ? bgColor : generateColorFromHSL(bgColor.h, bgColor.s, 100);
  return balanceColorContrast(fgColor, bgColor, level);
}

/**
 * @param {Object} fgColor - Foreground color
 * @param {Object} bgColor - Background color
 * @param {Number} level - Color contrast strictness level
 * @param {Boolean} useAPCA - Whether to use the APCA color contrast algorithm or WCAG 2
 * @param {Boolean} _transformFg - Whether to use the foreground or background as the target color
 * @param {Boolean|null} _darken - Whether to progressively darken or lighten the target color
 * @returns {Object} Balanced foreground and background colors, and their relative contrast
 */
export function balanceColorContrast(
  fgColor,
  bgColor,
  level = 2,
  useAPCA = USE_APCA,
  _transformFg = true,
  _darken = null
) {
  const transformFg = _transformFg;
  const darken = _darken === null ? darkForegroundHasHigherContrast(bgColor, useAPCA) : _darken;
  const currentL = transformFg ? parseFloat(fgColor.l) : parseFloat(bgColor.l);
  let l;
  let contrast;
  let passedContrastTest = false;

  // Lighten or darken the target color
  if (darken && currentL - 1 >= 0) {
    l = currentL - 1;
  } else if (!darken && currentL + 1 <= 100) {
    l = currentL + 1;
  } else {
    // Lightness has bottomed out at zero (black) or topped out at 100 (white), so test the contrast
    if (useAPCA) {
      contrast = contrastAPCA(fgColor.hex, bgColor.hex);
      passedContrastTest = contrastTestAPCA(contrast, level);
    } else {
      contrast = contrastWCAG2(fgColor.luminance, bgColor.luminance);
      passedContrastTest = contrastTestWCAG2(contrast, level);
    }
    // If the foreground color has maxed out and there still isn't sufficient contrast,
    // start lightening/darkening the background color
    if (!passedContrastTest && transformFg) {
      // console.log(`${darken ? "-" : "+"} foreground luminance maxed out`);
      return balanceColorContrast(fgColor, bgColor, level, useAPCA, false, !darken);
    }
    // If both foreground and background colors have maxxed out then this is the best we can do
    // console.log(`${darken ? "-" : "+"} background luminance maxed out`);
    return {
      foreground: fgColor,
      background: bgColor,
      contrast
    };
  }
  // console.log(`${darken ? "-" : "+"} try: ${l}`);

  // Test the contrast of the newly-generated color
  const newFgColor = transformFg ? generateColorFromHSL(fgColor.h, fgColor.s, l) : fgColor;
  const newBgColor = transformFg ? bgColor : generateColorFromHSL(bgColor.h, bgColor.s, l);

  if (useAPCA) {
    contrast = contrastAPCA(newFgColor.hex, newBgColor.hex);
    passedContrastTest = contrastTestAPCA(contrast, level);
  } else {
    contrast = contrastWCAG2(newFgColor.luminance, newBgColor.luminance);
    passedContrastTest = contrastTestWCAG2(contrast, level);
  }

  if (!passedContrastTest) {
    // Try again, darkening or lightening the color until it's accessible
    return balanceColorContrast(newFgColor, newBgColor, level, useAPCA, transformFg, darken);
  } else {
    // console.log(`${darken ? "-" : "+"} success: ${parseFloat(newColor.l)}`);
    return {
      foreground: newFgColor,
      background: newBgColor,
      contrast
    };
  }
}

export function generateComplimentaryColorFromHSL(h, s, l) {
  // Even though negative hue values produce valid HSL colors when passed to CSS' hsl() function,
  // the `HSLToRGB` function doesn't return the correct values when passed a negative hue
  const h1 = h - 180;
  const h2 = h + 180;
  const hVal = h1 < 0 ? h2 : h1;
  return generateColorFromHSL(hVal, s, l);
}

/**
 * Generate color objects from the page's primary and secondary hex colors
 * @param {Object} colors - Primary and secondary hex colors
 * @returns {Object} Primary and secondary color objects
 */
function generateBackgroundColors({ primaryHex, secondaryHex = null }) {
  const primaryHSL = hexToHSL(primaryHex);
  const primary = generateColorFromHSL(primaryHSL.h, primaryHSL.s, primaryHSL.l);

  let secondary;
  if (secondaryHex) {
    // Manually-defined secondary color
    const secondaryHSL = hexToHSL(secondaryHex);
    secondary = generateColorFromHSL(secondaryHSL.h, secondaryHSL.s, secondaryHSL.l);
  } else {
    // Generated complimentary color
    secondary = generateComplimentaryColorFromHSL(primaryHSL.h, primaryHSL.s, primaryHSL.l);
  }
  return { primary, secondary };
}

/**
 * Fetches color palette data from a given Sanity document
 * @param {Object} doc - A Sanity document (https://www.sanity.io/docs/document-type)
 * @returns {Object|null} in format: {primaryHex: "", secondaryHex: ""}
 */
function getDocumentColors(doc) {
  const palettes = doc?.image?.palette;
  const paletteName = doc?.colorPalette ?? "darkVibrant";
  const palette = palettes?.[paletteName];

  const isSanityPalette = paletteName !== "custom" && palette?.background;
  const isCustomPalette =
    paletteName === "custom" && doc?.primaryColor?.hex && doc?.secondaryColor?.hex;

  if (isSanityPalette) {
    return {
      primaryHex: palette.background
    };
  } else if (isCustomPalette) {
    return {
      primaryHex: doc.primaryColor.hex,
      secondaryHex: doc.secondaryColor.hex
    };
  }
  return null;
}

// function simplifyColorSet(colorSet) {
//   return {
//     foreground: colorSet.foreground.hex,
//     background: colorSet.background.hex,
//     contrast: colorSet.contrast
//   };
// }

/**
 * TODO
 * @param {Object} doc - A Sanity document (https://www.sanity.io/docs/document-type)
 * @returns {Object}
 */
export function getPageColors(doc) {
  const docColors = getDocumentColors(doc);
  const { primary, secondary } = generateBackgroundColors(docColors);
  const primaryLowContrast = generateColorSet(primary, 1);
  const primaryHighContrast = generateColorSet(primary, 2);
  const secondaryLowContrast = generateColorSet(secondary, 1);
  const secondaryHighContrast = generateColorSet(secondary, 2);

  // console.log("page colors", {
  //   primaryLow: simplifyColorSet(primaryLowContrast),
  //   primaryHigh: simplifyColorSet(primaryHighContrast),
  //   secondaryLow: simplifyColorSet(secondaryLowContrast),
  //   secondaryHigh: simplifyColorSet(secondaryHighContrast)
  // });
  const primaryBgHigh = primaryHighContrast.background.hex;
  const primaryBgLow = primaryLowContrast.background.hex;
  const primaryFgHigh = primaryHighContrast.foreground.hex;
  const primaryFgLow = primaryLowContrast.foreground.hex;
  const secondaryBgHigh = secondaryHighContrast.background.hex;
  const secondaryBgLow = secondaryLowContrast.background.hex;
  const secondaryFgHigh = secondaryHighContrast.foreground.hex;
  const secondaryFgLow = secondaryLowContrast.foreground.hex;

  return {
    primaryBgHigh,
    primaryBgLow,
    primaryFgHigh,
    primaryFgLow,
    secondaryBgHigh,
    secondaryBgLow,
    secondaryFgHigh,
    secondaryFgLow,
    css: `
      --primaryBgHigh: ${primaryBgHigh};
      --primaryBgLow: ${primaryBgLow};
      --primaryFgHigh: ${primaryFgHigh};
      --primaryFgLow: ${primaryFgLow};
      --secondaryBgHigh: ${secondaryBgHigh};
      --secondaryBgLow: ${secondaryBgLow};
      --secondaryFgHigh: ${secondaryFgHigh};
      --secondaryFgLow: ${secondaryFgLow};
    `
  };
}
