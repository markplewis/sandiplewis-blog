import { contrastAPCA, contrastTestAPCA } from "utils/color/apca";
import { colorTokens } from "utils/designTokens/colors";
import { hexToHSL, HSLToRGB, luminance, RGBToHex } from "utils/color/conversion";
import { contrastWCAG2, contrastTestWCAG2 } from "utils/color/wcag2";

const defaultColors = {
  primary: {
    background: colorTokens.darkGray,
    foreground: colorTokens.white
  },
  secondary: {
    background: colorTokens.white,
    foreground: colorTokens.darkGray
  }
};

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
 * TODO
 * @param {Object} bgColor - Background color
 * @returns {Object}
 */
export function generateBaseForegroundColor(bgColor) {
  const blackFgContrast = contrastWCAG2(0, bgColor.luminance); // Black foreground
  const whiteFgContrast = contrastWCAG2(1, bgColor.luminance); // White foreground
  const darken = blackFgContrast > whiteFgContrast;
  return {
    // A darker version of the background colour or pure white
    color: darken ? bgColor : generateColorFromHSL(bgColor.h, bgColor.s, 100),
    darkened: darken
  };
}

function generateContrastPageColors(bgColor, level) {
  const { color, darkened } = generateBaseForegroundColor(bgColor);
  return generateContrastColors(color, bgColor, true, darkened, level);
}

/**
 * @param {Object} fgColor - Foreground color
 * @param {Object} bgColor - Background color
 * @param {Boolean} transformFg - Whether to lighten/darken the foreground or background color
 * @param {Boolean} darken - Whether to progressively darken or lighten the color
 * @param {Number} level -
 * @param {Boolean} useAPCA - Whether to use the APCA color contrast algorithm or the WCAG 2 one
 * @returns {Object}
 */
export function generateContrastColors(
  fgColor,
  bgColor,
  transformFg = true,
  darken = false,
  level = 1,
  useAPCA = true
) {
  const currentL = transformFg ? parseFloat(fgColor.l) : parseFloat(bgColor.l);
  let l;
  let contrast;
  let passedContrastTest = false;

  if (darken && currentL - 1 >= 0) {
    l = currentL - 1; // Darken
  } else if (!darken && currentL + 1 <= 100) {
    l = currentL + 1; // Lighten
  } else {
    // Luminance has bottomed out at zero (black) or topped out at 100 (white)
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
      return generateContrastColors(fgColor, bgColor, false, !darken, level, useAPCA);
    }
    // If both foreground and background colors have maxxed out
    // console.log(`${darken ? "-" : "+"} background luminance maxed out`);
    return {
      foreground: fgColor,
      background: bgColor,
      contrast
    };
  }
  // console.log(`${darken ? "-" : "+"} try: ${l}`);

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
    return generateContrastColors(newFgColor, newBgColor, transformFg, darken, level, useAPCA);
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

function generateBackgroundColors({ primaryHex, secondaryHex = null }) {
  const primaryHSL = hexToHSL(primaryHex);
  const primary = generateColorFromHSL(primaryHSL.h, primaryHSL.s, primaryHSL.l);

  let secondary;
  if (secondaryHex) {
    // Manually-defined secondary color
    const secondaryHSL = hexToHSL(secondaryHex);
    secondary = generateColorFromHSL(secondaryHSL.h, secondaryHSL.s, secondaryHSL.l);
  } else {
    secondary = generateComplimentaryColorFromHSL(primaryHSL.h, primaryHSL.s, primaryHSL.l);
  }
  return { primary, secondary };
}

function generatePageColors(documentColors) {
  const backgroundColors = generateBackgroundColors(documentColors);
  return {
    primary: {
      largeText: generateContrastPageColors(backgroundColors.primary, 1),
      smallText: generateContrastPageColors(backgroundColors.primary, 2)
    },
    secondary: {
      largeText: generateContrastPageColors(backgroundColors.secondary, 1),
      smallText: generateContrastPageColors(backgroundColors.secondary, 2)
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

function simplifyColor(color) {
  return {
    hex: color.hex,
    hsl: `hsl(${color.h}deg, ${color.s}%, ${color.l}%)`
  };
}

/**
 * TODO
 * @param {Object} doc - A Sanity document (https://www.sanity.io/docs/document-type)
 * @returns {Object} in format:
 * {primary: {background: {}, foreground: {}}, secondary: {background: {}, foreground: {}}}
 */
export function getPageColors(doc) {
  const documentColors = getDocumentColors(doc);
  const colors = documentColors ? generatePageColors(documentColors) : defaultColors;
  return {
    primarySmTextBg: simplifyColor(colors?.primary?.smallText?.background),
    primarySmTextFg: simplifyColor(colors?.primary?.smallText?.foreground),
    primaryLgTextBg: simplifyColor(colors?.primary?.largeText?.background),
    primaryLgTextFg: simplifyColor(colors?.primary?.largeText?.foreground),
    secondarySmTextBg: simplifyColor(colors?.secondary?.smallText?.background),
    secondarySmTextFg: simplifyColor(colors?.secondary?.smallText?.foreground),
    secondaryLgTextBg: simplifyColor(colors?.secondary?.largeText?.background),
    secondaryLgTextFg: simplifyColor(colors?.secondary?.largeText?.foreground)
  };
}
