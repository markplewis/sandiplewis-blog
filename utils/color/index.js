import { colorTokens } from "utils/designTokens/colors";
import { hexToHSL, hexToNumber, HSLToRGB, luminance, RGBToHex } from "utils/color/conversion";
import { colorContrastRatio, colorContrastSmallTextAAA } from "utils/color/wcag2";

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
  const contrast = colorContrastRatio(originalColor.luminance, newColor.luminance);

  if (colorContrastSmallTextAAA(contrast)) {
    return generateAccessibleColor(originalColor, newColor, increment);
  } else {
    // console.log(`${increment ? "+" : "-"} success: ${parseFloat(newColor.l)}`);
    return newColor;
  }
}

function generateForegroundColor(color) {
  const blackForegroundContrast = colorContrastRatio(0, color.luminance);
  const whiteForegroundContrast = colorContrastRatio(1, color.luminance);
  const darkForegroundPreferred = blackForegroundContrast > whiteForegroundContrast;

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
