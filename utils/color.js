import { colors } from "utils/designTokens/colors";

const blackLuminance = luminance(51, 51, 51); // #333
const whiteLuminance = luminance(255, 255, 255); // #fff

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
  return { r, g, b };
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

function getPaletteEntryData(palette, key) {
  // Base colour
  let baseHex;
  let baseHSL;
  let baseRGB;
  let baseLuminance;

  if (key === "custom" && palette.primary) {
    baseHex = palette.primary;
    baseHSL = hexToHSL(palette.primary);
    baseRGB = hexToRGB(palette.primary);
  } else {
    baseHex = palette.background;
    baseHSL = hexToHSL(palette.background);
    baseRGB = hexToRGB(palette.background);
  }
  baseLuminance = luminance(baseRGB.r, baseRGB.g, baseRGB.b);

  // Complimentary colour
  let compHex;
  let compHSL;
  let compRGB;
  let compLuminance;

  if (key === "custom" && palette.secondary) {
    compHex = palette.secondary;
    compHSL = hexToHSL(palette.secondary);
    compRGB = hexToRGB(palette.secondary);
    compLuminance = luminance(compRGB.r, compRGB.g, compRGB.b);
  } else {
    // Even though negative hue values produce valid HSL colours, the `HSLToRGB`
    // function doesn't return the correct values when passed a negative hue
    const h1 = baseHSL.h - 180;
    const h2 = baseHSL.h + 180;
    compHSL = {
      h: h1 < 0 ? h2 : h1,
      s: baseHSL.s,
      l: baseHSL.l
    };
    compRGB = HSLToRGB(compHSL.h, compHSL.s, compHSL.l);
    compHex = RGBToHex(compRGB.r, compRGB.g, compRGB.b);
    compLuminance = luminance(compRGB.r, compRGB.g, compRGB.b);
  }

  return {
    key,
    base: {
      hex: baseHex,
      ...baseHSL,
      ...baseRGB,
      hsl: `hsl(${baseHSL.h}deg, ${baseHSL.s}%, ${baseHSL.l}%)`,
      rgb: `rgb(${baseRGB.r}, ${baseRGB.g}, ${baseRGB.b})`,
      luminance: baseLuminance
    },
    comp: {
      hex: compHex,
      ...compHSL,
      ...compRGB,
      hsl: `hsl(${compHSL.h}deg, ${compHSL.s}%, ${compHSL.l}%)`,
      rgb: `rgb(${compRGB.r}, ${compRGB.g}, ${compRGB.b})`,
      luminance: compLuminance
    }
  };
}

function getPaletteData(palette) {
  const paletteKeys = [
    "darkMuted",
    "darkVibrant",
    "dominant",
    "lightMuted",
    "lightVibrant",
    "muted",
    "vibrant",
    "custom"
  ];
  return paletteKeys
    .map(key => {
      if (!palette || !palette[key]) {
        return null;
      }
      return getPaletteEntryData(palette[key], key);
    })
    .filter(obj => obj);
}

// AA  large text - 3:1
// AA  small text - 4.5:1
// AAA large text - 4.5:1
// AAA small text - 7:1

const testResults = num => {
  return [num < 1 / 3, num < 1 / 4.5, num < 1 / 7].filter(v => v);
};

export function getColorData(palette) {
  const paletteData = getPaletteData(palette);
  const colorData = {};

  paletteData.forEach(({ key, base, comp }) => {
    // Colour contrast on black
    const { float: baseContrastFloatBlack, ratio: baseContrastRatioBlack } = contrastRatio(
      base.luminance,
      blackLuminance
    );
    const { float: compContrastFloatBlack, ratio: compContrastRatioBlack } = contrastRatio(
      comp.luminance,
      blackLuminance
    );
    // Colour contrast on white
    const { float: baseContrastFloatWhite, ratio: baseContrastRatioWhite } = contrastRatio(
      base.luminance,
      whiteLuminance
    );
    const { float: compContrastFloatWhite, ratio: compContrastRatioWhite } = contrastRatio(
      comp.luminance,
      whiteLuminance
    );

    const baseBlackTextPreferred =
      testResults(baseContrastFloatBlack).length > testResults(baseContrastFloatWhite).length;

    const compBlackTextPreferred =
      testResults(compContrastFloatBlack).length > testResults(compContrastFloatWhite).length;

    colorData[key] = {
      base: {
        background: base,
        foreground: baseBlackTextPreferred ? colors.baseText : colors.baseBackground,
        contrastRatio: baseBlackTextPreferred ? baseContrastRatioBlack : baseContrastRatioWhite,
        contrastFloat: baseBlackTextPreferred ? baseContrastFloatBlack : baseContrastFloatWhite
      },
      comp: {
        background: comp,
        foreground: compBlackTextPreferred ? colors.baseText : colors.baseBackground,
        contrastRatio: compBlackTextPreferred ? compContrastRatioBlack : compContrastRatioWhite,
        contrastFloat: compBlackTextPreferred ? compContrastFloatBlack : compContrastFloatWhite
      }
    };
  });

  return colorData;
}

export function getColors({
  palettes,
  paletteKey = "darkVibrant",
  customPrimary,
  customSecondary
}) {
  const colorData =
    paletteKey === "custom" && customPrimary?.hex && customSecondary?.hex
      ? getColorData({
          custom: { primary: customPrimary.hex, secondary: customSecondary.hex }
        })
      : getColorData(palettes);

  return {
    baseColor: colorData?.[paletteKey]?.base ?? null,
    compColor: colorData?.[paletteKey]?.comp ?? null
  };
}
