import { colorTokens } from "utils/designTokens/colors";
import { hexToHSL, hexToNumber, HSLToRGB, luminance, RGBToHex } from "utils/color/conversion";

const defaultColors = {
  primary: {
    background: colorTokens.black,
    foreground: colorTokens.white
  },
  secondary: {
    background: colorTokens.white,
    foreground: colorTokens.black
  }
};

function generateColorFromHSL(h, s, l) {
  const { r, g, b } = HSLToRGB(h, s, l);
  const hex = RGBToHex(r, g, b);
  const lum = luminance(r, g, b);
  return {
    hex,
    hexNumber: hexToNumber(hex),
    h,
    s,
    l,
    r,
    g,
    b,
    hsl: `hsl(${h}deg, ${s}%, ${l}%)`,
    rgb: `rgb(${r}, ${g}, ${b})`,
    luminance: lum
  };
}

// AA  large text - 3:1
// AA  small text - 4.5:1
// AAA large text - 4.5:1
// AAA small text - 7:1
const wcag2ContrastRatioResults = num => {
  return [num < 1 / 3, num < 1 / 4.5, num < 1 / 7].filter(v => v);
};

function generateAccessibleColor(originalColor, testColor = null, increment = false) {
  if (!testColor) {
    testColor = originalColor;
  }
  const current = parseFloat(testColor.l);
  let l;
  if (increment && current + 1 <= 100) {
    l = current + 1;
  } else if (!increment && current - 1 >= 0) {
    l = current - 1;
  } else {
    // Colour bottoms out at zero (black) or reaches 100 (white)
    // console.log(`${increment ? "+" : "-"} fail`);
    return testColor;
  }
  // console.log(`${increment ? "+" : "-"} try: ${l}`);

  const newColor = generateColorFromHSL(testColor.h, testColor.s, l);
  const { float } = wcag2ContrastRatio(originalColor.luminance, newColor.luminance);
  const results = wcag2ContrastRatioResults(float);

  if (results.length < 3) {
    return generateAccessibleColor(originalColor, newColor, increment);
  } else {
    // console.log(`${increment ? "+" : "-"} success: ${parseFloat(newColor.l)}`);
    return newColor;
  }
}

// https://stackoverflow.com/a/11832950/1243086
// https://sciencing.com/convert-fraction-ratio-8430467.html

/**
 * TODO
 * @param {Number} lum1 - Luminence 1
 * @param {Number} lum2 - Luminence 2
 * @returns {Object}
 */
function wcag2ContrastRatio(lum1, lum2) {
  const num1 = lum2 > lum1 ? lum1 + 0.05 : lum2 + 0.05;
  const num2 = lum2 > lum1 ? lum2 + 0.05 : lum1 + 0.05;
  return {
    ratio: `${Math.round((num2 / num1 + Number.EPSILON) * 100) / 100}:${num1 / num1}`,
    float: Math.round((num1 / num2 + Number.EPSILON) * 100) / 100
  };
}

function generateForegroundColor(color) {
  const { float: blackForegroundContrast } = wcag2ContrastRatio(0, color.luminance);
  const { float: whiteForegroundContrast } = wcag2ContrastRatio(1, color.luminance);

  const darkForegroundPreferred =
    wcag2ContrastRatioResults(blackForegroundContrast).length >
    wcag2ContrastRatioResults(whiteForegroundContrast).length;

  const foreground = darkForegroundPreferred
    ? generateAccessibleColor(color, generateColorFromHSL(color.h, color.s, 10)) // Nearly black
    : generateAccessibleColor(color, generateColorFromHSL(color.h, color.s, 90), true); // Nearly white

  return foreground;
}

function generateBackgroundColors({ primaryHex, secondaryHex = null }) {
  const primaryHSL = hexToHSL(primaryHex);
  const primary = generateColorFromHSL(primaryHSL.h, primaryHSL.s, primaryHSL.l);

  let secondary;
  if (secondaryHex) {
    // Manually-defined secondary colour
    const secondaryHSL = hexToHSL(secondaryHex);
    secondary = generateColorFromHSL(secondaryHSL.h, secondaryHSL.s, secondaryHSL.l);
  } else {
    // Generate a complimentary colour
    // Even though negative hue values produce valid HSL colours when passed to CSS' hsl() function,
    // the `HSLToRGB` function doesn't return the correct values when passed a negative hue
    const h1 = primaryHSL.h - 180;
    const h2 = primaryHSL.h + 180;
    const h = h1 < 0 ? h2 : h1;
    secondary = generateColorFromHSL(h, primaryHSL.s, primaryHSL.l);
  }
  return { primary, secondary };
}

function generatePageColors(documentColors) {
  const backgroundColors = generateBackgroundColors(documentColors);
  return {
    primary: {
      background: backgroundColors.primary,
      foreground: generateForegroundColor(backgroundColors.primary)
    },
    secondary: {
      background: backgroundColors.secondary,
      foreground: generateForegroundColor(backgroundColors.secondary)
    }
  };
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

/**
 * TODO
 * @param {Object} doc - A Sanity document (https://www.sanity.io/docs/document-type)
 * @returns {Object} in format:
 * {primary: {background: {}, foreground: {}}, secondary: {background: {}, foreground: {}}}
 */
export function getPageColors(doc) {
  const documentColors = getDocumentColors(doc);
  return documentColors ? generatePageColors(documentColors) : defaultColors;
}
