import swatchStyles from "components/CoverImage.module.css";

export const colors = {
  baseBackgroundColor: "#fff",
  baseFontColor: "#333"
};

const blackLuminance = luminance(0, 0, 0);
const whiteLuminance = luminance(255, 255, 255);

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
      // Base colour
      let baseHSL;
      let baseRGB;

      if (key === "custom" && palette[key].primary) {
        baseHSL = hexToHSL(palette[key].primary);
        baseRGB = hexToRGB(palette[key].primary);
      } else {
        baseHSL = hexToHSL(palette[key].background);
        baseRGB = hexToRGB(palette[key].background);
      }
      const baseLuminance = luminance(baseRGB.r, baseRGB.g, baseRGB.b);

      // Complimentary colour
      let compHSL;
      let compRGB;
      let compLuminance;

      if (key === "custom" && palette[key].secondary) {
        compHSL = hexToHSL(palette[key].secondary);
        compRGB = hexToRGB(palette[key].secondary);
        compLuminance = luminance(compRGB.r, compRGB.g, compRGB.b);
      } else {
        compHSL = {
          h: baseHSL.h - 180,
          s: baseHSL.s,
          l: baseHSL.l
        };
        compRGB = HSLToRGB(...Object.values(compHSL));
        compLuminance = luminance(...Object.values(compRGB));
      }

      return {
        key,
        base: {
          ...baseHSL,
          luminance: baseLuminance
        },
        comp: {
          ...compHSL,
          luminance: compLuminance
        }
      };
    })
    .filter(obj => obj);
}

const testResults = num => {
  return [num < 1 / 3, num < 1 / 4.5, num < 1 / 4.5, num < 1 / 7].filter(v => v);
};

export function getColorData(palette) {
  const paletteData = getPaletteData(palette);
  const colorData = {};

  paletteData.forEach(({ key, base, comp }) => {
    // Black
    const { float: baseFloatBlack, ratio: baseRatioBlack } = contrastRatio(
      base.luminance,
      blackLuminance
    );
    const { float: compFloatBlack, ratio: compRatioBlack } = contrastRatio(
      comp.luminance,
      blackLuminance
    );
    // White
    const { float: baseFloatWhite, ratio: baseRatioWhite } = contrastRatio(
      base.luminance,
      whiteLuminance
    );
    const { float: compFloatWhite, ratio: compRatioWhite } = contrastRatio(
      comp.luminance,
      whiteLuminance
    );

    const baseBgColor = `hsl(${base.h}deg, ${base.s}%, ${base.l}%)`;
    const compBgColor = `hsl(${comp.h}deg, ${comp.s}%, ${comp.l}%)`;

    const baseBlackPreferred =
      testResults(baseFloatBlack).length > testResults(baseFloatWhite).length;

    const compBlackPreferred =
      testResults(compFloatBlack).length > testResults(compFloatWhite).length;

    colorData[key] = {
      base: {
        background: baseBgColor,
        foreground: baseBlackPreferred ? "black" : "white",
        ratio: baseBlackPreferred ? baseRatioBlack : baseRatioWhite,
        float: baseBlackPreferred ? baseFloatBlack : baseFloatWhite
      },
      comp: {
        background: compBgColor,
        foreground: compBlackPreferred ? "black" : "white",
        ratio: compBlackPreferred ? compRatioBlack : compRatioWhite,
        float: compBlackPreferred ? compFloatBlack : compFloatWhite
      }
    };
  });

  return colorData;
}

const pass = <span style={{ textTransform: "uppercase", color: "green" }}>Pass</span>;
const fail = <span style={{ textTransform: "uppercase", color: "red" }}>Fail</span>;

const stats = (num, label) => {
  return (
    <div>
      <p>
        <strong>{label}</strong>
      </p>
      AA lg (3:1) {num < 1 / 3 ? pass : fail}
      <br />
      AA sm (4.5:1) {num < 1 / 4.5 ? pass : fail}
      <br />
      AAA lg (4.5:1) {num < 1 / 4.5 ? pass : fail}
      <br />
      AAA sm (7:1) {num < 1 / 7 ? pass : fail}
    </div>
  );
};

export function getSwatches(colorData) {
  return Object.keys(colorData).map(key => {
    return (
      <div key={key} className={swatchStyles.paletteGroup}>
        <p>
          <strong>{key}</strong>
        </p>
        {Object.entries(colorData[key]).map(([label, { background, foreground, ratio, float }]) => {
          return (
            <div key={`${key}-${label}-${background}`} className={swatchStyles.swatchGroup}>
              <div
                className={swatchStyles.swatch}
                style={{
                  backgroundColor: background,
                  color: foreground
                }}>
                {ratio}
              </div>
              {stats(float, label)}
            </div>
          );
        })}
      </div>
    );
  });
}
