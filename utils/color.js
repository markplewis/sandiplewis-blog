// See: https://css-tricks.com/converting-color-spaces-in-javascript/#hex-to-hsl
// https://www.sarasoueidan.com/blog/hex-rgb-to-hsl/#hsl-and-color-harmonies
// https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o

export function hexToRGB(H) {
  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0;
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

export function hexToHSL(H) {
  let { r, g, b } = hexToRGB(H);
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
}

export function HSLToRGB(h, s, l) {
  // Must be fractions of 1
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

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

export function luminance(r, g, b) {
  var a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// https://stackoverflow.com/a/11832950/1243086
// https://sciencing.com/convert-fraction-ratio-8430467.html
export function contrastRatio(bgLuminance, fgLuminance) {
  // return bgLuminance > fgLuminance
  //   ? (fgLuminance + 0.05) / (bgLuminance + 0.05)
  //   : (bgLuminance + 0.05) / (fgLuminance + 0.05);
  const num1 = bgLuminance > fgLuminance ? fgLuminance + 0.05 : bgLuminance + 0.05;
  const num2 = bgLuminance > fgLuminance ? bgLuminance + 0.05 : fgLuminance + 0.05;
  return {
    ratio: `${Math.round((num2 / num1 + Number.EPSILON) * 100) / 100}:${num1 / num1}`,
    float: Math.round((num1 / num2 + Number.EPSILON) * 100) / 100
  };
}
