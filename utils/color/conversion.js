// https://css-tricks.com/converting-color-spaces-in-javascript/#hex-to-hsl
// https://www.sarasoueidan.com/blog/hex-rgb-to-hsl/#hsl-and-color-harmonies

/**
 * Converts the provided hex color into HSL format
 * @param {String} hex - Hex color
 * @returns {Object}
 */
export function hexToHSL(hex) {
  let { r, g, b } = hexToRGB(hex);
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

/**
 * Ensures that the provided hex color is six digits long
 * @param {String} hex - Hex color
 * @returns {String}
 */
export function hexToLongHex(hex) {
  let r;
  let g;
  let b;

  if (hex.length === 4) {
    r = hex[1] + hex[1];
    g = hex[2] + hex[2];
    b = hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = hex[1] + hex[2];
    g = hex[3] + hex[4];
    b = hex[5] + hex[6];
  }
  return `#${r}${g}${b}`;
}

/**
 * Converts the provided hex color into its numerical equivalent
 * @param {String} hex - Hex color
 * @returns {Number}
 */
export function hexToNumber(hex) {
  const h = hex.replace("#", "0x");
  return parseInt(h, 16); // Or we could use `+h` instead
}

/**
 * Converts the provided hex color into RGB format
 * @param {String} hex - Hex color
 * @returns {Object}
 */
export function hexToRGB(hex) {
  let r;
  let g;
  let b;

  if (hex.length === 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  // Prepend the variables with + to convert them from strings to numbers
  // (or we could use `parseInt(r, 16)` instead)
  return { r: +r, g: +g, b: +b };
}

/**
 * Converts the provided HSL color into RGB format
 * @param {Number} h - Hue
 * @param {Number} s - Saturation
 * @param {Number} l - Lightness
 * @returns {Object}
 */
export function HSLToRGB(h, s, l) {
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

/**
 * Calculates the luminance of the provided RGB color
 * @see https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o
 * @see https://stackoverflow.com/questions/9733288/how-to-programmatically-calculate-the-contrast-ratio-between-two-colors/9733420#9733420
 * @param {Number} r - Red
 * @param {Number} g - Green
 * @param {Number} b - Blue
 * @returns {Number} Between 0 (black) and 1 (white)
 */
export function luminance(r, g, b) {
  let a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Converts the provided RGB color into hex format
 * @param {Number} r - Red
 * @param {Number} g - Green
 * @param {Number} b - Blue
 * @returns {String}
 */
export function RGBToHex(r, g, b) {
  let rr = r.toString(16);
  let gg = g.toString(16);
  let bb = b.toString(16);

  // Zero padding
  if (rr.length === 1) rr = `0${rr}`;
  if (gg.length === 1) gg = `0${gg}`;
  if (bb.length === 1) bb = `0${bb}`;

  return hexToLongHex(`#${rr}${gg}${bb}`);
}
