import {
  colorContrastRatio,
  colorContrastLargeTextAA,
  colorContrastSmallTextAA,
  colorContrastLargeTextAAA,
  colorContrastSmallTextAAA
} from "utils/color/wcag2";

describe("wcag2ContrastRatio", () => {
  it("should return WCAG 2 color contrast ratio for luminence values", () => {
    const actual = colorContrastRatio(0.36567143337890545, 0.6584736463746574);
    const expected = 1.7;
    expect(actual).toEqual(expected);
  });
  it("should return WCAG 2 color contrast ratio for black and white luminence values", () => {
    const actual = colorContrastRatio(0, 1);
    const expected = 21;
    expect(actual).toEqual(expected);
  });
  it("should return WCAG 2 color contrast ratio with 2 decimal places", () => {
    const actual = colorContrastRatio(0.36567143337890545, 0.7584736463746574);
    const expected = 1.94;
    expect(actual).toEqual(expected);
  });
});

describe("colorContrastLargeTextAA", () => {
  it("should pass large text AA", () => {
    expect(colorContrastLargeTextAA(0.3)).toEqual(true);
  });
  it("should fail large text AA", () => {
    expect(colorContrastLargeTextAA(0.35)).toEqual(false);
  });
});

describe("colorContrastSmallTextAA", () => {
  it("should pass small text AA", () => {
    expect(colorContrastSmallTextAA(0.15)).toEqual(true);
  });
  it("should fail small text AA", () => {
    expect(colorContrastSmallTextAA(0.3)).toEqual(false);
  });
});

describe("colorContrastLargeTextAAA", () => {
  it("should pass large text AAA", () => {
    expect(colorContrastLargeTextAAA(0.2)).toEqual(true);
  });
  it("should fail large text AAA", () => {
    expect(colorContrastLargeTextAAA(0.24)).toEqual(false);
  });
});

describe("colorContrastSmallTextAAA", () => {
  it("should pass small text AAA", () => {
    expect(colorContrastSmallTextAAA(0.1)).toEqual(true);
  });
  it("should fail small text AAA", () => {
    expect(colorContrastSmallTextAAA(0.15)).toEqual(false);
  });
});
