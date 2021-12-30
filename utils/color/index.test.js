import {
  generateForegroundColor,
  generateColorFromHSL,
  generateComplimentaryColorFromHSL,
  balanceColorContrast
} from "utils/color";

const blue = {
  hex: "#58a6ff",
  h: 212,
  s: 100,
  l: 67.3,
  r: 88,
  g: 166,
  b: 255,
  luminance: 0.36567143337890545
};

const blueDarkened = {
  hex: "#00152e",
  h: 212,
  s: 100,
  l: 9,
  r: 0,
  g: 21,
  b: 46,
  luminance: 0.007335876093656568
};

const blueDarkBase = {
  hex: "#001833",
  h: 212,
  s: 100,
  l: 10,
  r: 0,
  g: 24,
  b: 51,
  luminance: 0.008922842930246207
};

const red = {
  hex: "#7d0707",
  h: 0,
  s: 89,
  l: 26,
  r: 125,
  g: 7,
  b: 7,
  luminance: 0.04527271938450586
};

const redLightened = {
  hex: "#fcd4d4",
  h: 0,
  s: 89,
  l: 91,
  r: 252,
  g: 212,
  b: 212,
  luminance: 0.7253587998645402
};

const redLightBase = {
  hex: "#fccfcf",
  h: 0,
  s: 89,
  l: 90,
  r: 252,
  g: 207,
  b: 207,
  luminance: 0.6982608811436574
};

describe("generateForegroundColor", () => {
  it("should generate dark blue foreground color, starting from an edge color", () => {
    const actual = generateForegroundColor(blue, false);
    const expected = { color: blueDarkBase, isDark: true };
    expect(actual).toEqual(expected);
  });
  it("should generate light red foreground color, starting from an edge color", () => {
    const actual = generateForegroundColor(red, false);
    const expected = { color: redLightBase, isDark: false };
    expect(actual).toEqual(expected);
  });
});

describe("generateColorFromHSL", () => {
  it("should generate a blue color object from HSL values", () => {
    const actual = generateColorFromHSL(blue.h, blue.s, blue.l);
    const expected = blue;
    expect(actual).toEqual(expected);
  });
  it("should generate a red color object from HSL values", () => {
    const actual = generateColorFromHSL(red.h, red.s, red.l);
    const expected = red;
    expect(actual).toEqual(expected);
  });
});

describe("generateComplimentaryColorFromHSL", () => {
  it("should generate complimentary color for blue", () => {
    const actual = generateComplimentaryColorFromHSL(blue.h, blue.s, blue.l);
    const expected = {
      hex: "#ffb158",
      h: 32,
      s: 100,
      l: 67.3,
      r: 255,
      g: 177,
      b: 88,
      luminance: 0.5340886171946676
    };
    expect(actual).toEqual(expected);
  });
});

describe("balanceColorContrast", () => {
  it("should generate accessible dark foreground color using WCAG 2 algorithm", () => {
    const actual = balanceColorContrast(blueDarkBase, blue, true, true, 1, false);
    const expected = {
      foreground: blueDarkened,
      background: blue,
      contrast: 7.25
    };
    expect(actual).toEqual(expected);
  });
  it("should generate accessible light foreground color using WCAG 2 algorithm", () => {
    const actual = balanceColorContrast(redLightBase, red, true, false, 1, false);
    const expected = {
      foreground: redLightened,
      background: red,
      contrast: 8.14
    };
    expect(actual).toEqual(expected);
  });
  // it("should fail to generate accessible light foreground color", () => {
  //   TODO: how to write this?
  // });
});
