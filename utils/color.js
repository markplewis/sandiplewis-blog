import { colors } from "utils/designTokens/colors";

// https://css-tricks.com/converting-color-spaces-in-javascript/#hex-to-hsl
// https://www.sarasoueidan.com/blog/hex-rgb-to-hsl/#hsl-and-color-harmonies
// https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o

function hexToRGB(H) {
  let r = 0;
  let g = 0;
  let b = 0;

  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Prepend the variables with + to convert them from strings back to numbers
  return { r: +r, g: +g, b: +b };
}

function hexToHSL(H) {
  let { r, g, b } = hexToRGB(H);
  r /= 255;
  g /= 255;
  b /= 255;

  let cmin = Math.min(r, g, b);
  let cmax = Math.max(r, g, b);
  let delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  if (delta == 0) {
    h = 0;
  } else if (cmax == r) {
    h = ((g - b) / delta) % 6;
  } else if (cmax == g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60);

  if (h < 0) {
    h += 360;
  }
  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
}

function HSLToRGB(h, s, l) {
  // Ensure that hue value is positive
  // if (h < 0) {
  //   h = 360 + h;
  // }
  // Must be fractions of 1
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  let m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}

function RGBToHex(r, g, b) {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
}

function luminance(r, g, b) {
  let a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// https://stackoverflow.com/a/11832950/1243086
// https://sciencing.com/convert-fraction-ratio-8430467.html

function contrastRatio(bgLuminance, fgLuminance) {
  const num1 = bgLuminance > fgLuminance ? fgLuminance + 0.05 : bgLuminance + 0.05;
  const num2 = bgLuminance > fgLuminance ? bgLuminance + 0.05 : fgLuminance + 0.05;
  return {
    ratio: `${Math.round((num2 / num1 + Number.EPSILON) * 100) / 100}:${num1 / num1}`,
    float: Math.round((num1 / num2 + Number.EPSILON) * 100) / 100
  };
}

function generateColorFromHSL(h, s, l) {
  const { r, g, b } = HSLToRGB(h, s, l);
  const hex = RGBToHex(r, g, b);
  const lum = luminance(r, g, b);
  return {
    hex,
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
const testResults = num => {
  return [num < 1 / 3, num < 1 / 4.5, num < 1 / 7].filter(v => v);
};

function getColorForegroundData(color) {
  const { float: contrastOnBlack } = contrastRatio(color.luminance, 0);
  const { float: contrastOnWhite } = contrastRatio(color.luminance, 1);

  const darkForegroundPreferred =
    testResults(contrastOnBlack).length > testResults(contrastOnWhite).length;

  const foreground = darkForegroundPreferred
    ? generateAccessibleColor(color, generateColorFromHSL(color.h, color.s, 10))
    : colors.baseBackground; // White
  // : generateAccessibleColor(color, generateColorFromHSL(color.h, color.s, 90), true);

  return foreground;
}

function generateAccessibleColor(originalColor, testColor = null, increment = false) {
  if (!testColor) {
    testColor = originalColor;
  }
  const current = parseFloat(testColor.l);
  let l = null;
  if (increment && current + 1 <= 100) {
    l = current + 1;
  } else if (!increment && current - 1 >= 0) {
    l = current - 1;
  }
  if (l === null) {
    // console.log(`${increment ? "+" : "-"} fail`);
    return testColor;
  }
  // console.log(`${increment ? "+" : "-"} try: ${l}`);

  const newColor = generateColorFromHSL(testColor.h, testColor.s, l);
  const { float } = contrastRatio(originalColor.luminance, newColor.luminance);
  const results = testResults(float);

  if (results.length < 2) {
    return generateAccessibleColor(originalColor, newColor, increment);
  } else {
    // console.log(`${increment ? "+" : "-"} success: ${parseFloat(newColor.l)}`);
    return newColor;
  }
}

// { background, foreground }
// { primary, secondary }
function getPaletteData(palette, key) {
  // Base colour
  const baseHex = key === "custom" && palette?.primary ? palette.primary : palette.background;
  const baseHSL = hexToHSL(baseHex);
  const base = generateColorFromHSL(baseHSL.h, baseHSL.s, baseHSL.l);

  // Complimentary colour
  let comp;
  if (key === "custom" && palette?.secondary) {
    const compHex = palette.secondary;
    const compHSL = hexToHSL(compHex);
    comp = generateColorFromHSL(compHSL.h, compHSL.s, compHSL.l);
  } else {
    // Even though negative hue values produce valid HSL colours when passed to CSS' hsl() function,
    // the `HSLToRGB` function doesn't return the correct values when passed a negative hue
    const h1 = baseHSL.h - 180;
    const h2 = baseHSL.h + 180;
    const h = h1 < 0 ? h2 : h1;
    comp = generateColorFromHSL(h, baseHSL.s, baseHSL.l);
  }
  return { base, comp };
}

export function getColorData(palette, paletteKey) {
  const { base, comp } = getPaletteData(palette, paletteKey);
  return {
    base: {
      background: base,
      foreground: getColorForegroundData(base)
    },
    comp: {
      background: comp,
      foreground: getColorForegroundData(comp)
    }
  };
}

function getColors({ palette, paletteKey, customPrimary, customSecondary }) {
  const colorData =
    paletteKey === "custom" && customPrimary?.hex && customSecondary?.hex
      ? getColorData({ primary: customPrimary.hex, secondary: customSecondary.hex }, paletteKey)
      : getColorData(palette, paletteKey);
  return {
    base: {
      background: colorData?.base?.background ?? colors.baseBackground,
      foreground: colorData?.base?.foreground ?? colors.baseText
    },
    comp: {
      background: colorData?.comp?.background ?? colors.baseBackground,
      foreground: colorData?.comp?.foreground ?? colors.baseText
    }
  };
}

export function getPageColors(post) {
  const palettes = post?.image?.palette;
  const paletteKey = post?.colorPalette ?? "darkVibrant";
  const palette = palettes?.[paletteKey];

  if (
    (paletteKey === "custom" && (!post?.primaryColor || !post?.secondaryColor)) ||
    (paletteKey !== "custom" && !palette)
  ) {
    console.log("Missing something", {
      palette,
      primaryColor: post?.primaryColor,
      secondaryColor: post?.secondaryColor
    });
    return {
      base: {
        background: colors.baseBackground,
        foreground: colors.baseText
      },
      comp: {
        background: colors.baseBackground,
        foreground: colors.baseText
      }
    };
  }

  return getColors({
    palette: palettes?.[paletteKey], // { background, foreground } || undefined
    paletteKey,
    customPrimary: post?.primaryColor, // { hex } || null
    customSecondary: post?.secondaryColor
  });
}
