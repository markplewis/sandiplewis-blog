import {
  balanceColorContrast,
  darkForegroundHasHigherContrast,
  generateColorFromHSL,
  generateComplimentaryColorFromHSL
} from "utils/color";

const darkBlue = {
  hex: "#0960c3",
  h: 212,
  s: 91,
  l: 40,
  r: 9,
  g: 96,
  b: 195,
  luminance: 0.12363949622213677
};

const lightBlue = {
  hex: "#a1cdf7",
  h: 209,
  s: 84,
  l: 80,
  r: 161,
  g: 205,
  b: 247,
  luminance: 0.579551106861918
};

describe("balanceColorContrast - APCA algorithm", () => {
  // Original: https://www.myndex.com/APCA/?BG=a1cdf7&TXT=0960c3&DEV=98G4g&BUF=APCA-G
  // Final: https://www.myndex.com/APCA/?BG=a1cdf7&TXT=000205&DEV=98G4g&BUF=APCA-G
  it("should generate accessible color combination when dark foreground is preferred", () => {
    const actual = balanceColorContrast(darkBlue, lightBlue, 2, true);
    const expected = {
      // A darkened version of `darkBlue`
      foreground: {
        hex: "#000205",
        h: 212,
        s: 91,
        l: 1,
        r: 0,
        g: 2,
        b: 5,
        luminance: 0.0005437382383293875
      },
      background: lightBlue,
      contrast: 75
    };
    expect(actual).toEqual(expected);
  });

  // Original: https://www.myndex.com/APCA/?BG=0960c3&TXT=a1cdf7&DEV=98G4g&BUF=APCA-G
  // Final: https://www.myndex.com/APCA/?BG=0960c3&TXT=e8f3fd&DEV=98G4g&BUF=APCA-G
  it("should generate accessible color combination when light foreground is preferred", () => {
    const actual = balanceColorContrast(lightBlue, darkBlue, 2, true);
    const expected = {
      // A lightened version of `lightBlue`
      foreground: {
        hex: "#e8f3fd",
        h: 209,
        s: 84,
        l: 95,
        r: 232,
        g: 243,
        b: 253,
        luminance: 0.8834883812478093
      },
      background: darkBlue,
      contrast: 76
    };
    expect(actual).toEqual(expected);
  });
});

describe("balanceColorContrast - WCAG 2 algorithm", () => {
  // Original: https://webaim.org/resources/contrastchecker/?fcolor=0960C3&bcolor=A1CDF7
  // Final: https://webaim.org/resources/contrastchecker/?fcolor=053770&bcolor=A1CDF7
  it("should generate accessible color combination when dark foreground is preferred", () => {
    const actual = balanceColorContrast(darkBlue, lightBlue, 2, false);
    const expected = {
      // A darkened version of `darkBlue`
      foreground: {
        hex: "#053770",
        h: 212,
        s: 91,
        l: 23,
        r: 5,
        g: 55,
        b: 112,
        luminance: 0.03934493666964804
      },
      background: lightBlue,
      contrast: 7.05
    };
    expect(actual).toEqual(expected);
  });

  // Original: https://webaim.org/resources/contrastchecker/?fcolor=A1CDF7&bcolor=0960C3
  // Final: https://webaim.org/resources/contrastchecker/?fcolor=FFFFFF&bcolor=0856Af
  it("should generate accessible color combination when light foreground is preferred", () => {
    const actual = balanceColorContrast(lightBlue, darkBlue, 2, false);
    const expected = {
      // A lightened version of `lightBlue`
      foreground: {
        hex: "#ffffff",
        h: 209,
        s: 84,
        l: 100,
        r: 255,
        g: 255,
        b: 255,
        luminance: 1
      },
      // A darkened version of `darkBlue`
      background: {
        hex: "#0856af",
        h: 212,
        s: 91,
        l: 36,
        r: 8,
        g: 86,
        b: 175,
        luminance: 0.09802346277709478
      },
      contrast: 7.09
    };
    expect(actual).toEqual(expected);
  });
});

describe("darkForegroundHasHigherContrast - APCA algorithm", () => {
  it("should be false for dark color", () => {
    expect(darkForegroundHasHigherContrast(darkBlue, true)).toEqual(false);
  });
  it("should be true for light color", () => {
    expect(darkForegroundHasHigherContrast(lightBlue, true)).toEqual(true);
  });
});

describe("darkForegroundHasHigherContrast - WCAG 2 algorithm", () => {
  it("should be false for dark color", () => {
    expect(darkForegroundHasHigherContrast(darkBlue, false)).toEqual(false);
  });
  it("should be true for light color", () => {
    expect(darkForegroundHasHigherContrast(lightBlue, false)).toEqual(true);
  });
});

describe("generateColorFromHSL", () => {
  it("should generate dark blue color object from HSL values", () => {
    const actual = generateColorFromHSL(darkBlue.h, darkBlue.s, darkBlue.l);
    const expected = darkBlue;
    expect(actual).toEqual(expected);
  });
  it("should generate light blue color object from HSL values", () => {
    const actual = generateColorFromHSL(lightBlue.h, lightBlue.s, lightBlue.l);
    const expected = lightBlue;
    expect(actual).toEqual(expected);
  });
});

describe("generateComplimentaryColorFromHSL", () => {
  // Comparison: https://webaim.org/resources/contrastchecker/?fcolor=0960C3&bcolor=C36C09
  it("should generate complimentary color", () => {
    const actual = generateComplimentaryColorFromHSL(darkBlue.h, darkBlue.s, darkBlue.l);
    const expected = {
      hex: "#c36c09",
      h: 32,
      s: 91,
      l: 40,
      r: 195,
      g: 108,
      b: 9,
      luminance: 0.22346949399375896
    };
    expect(actual).toEqual(expected);
  });
});
