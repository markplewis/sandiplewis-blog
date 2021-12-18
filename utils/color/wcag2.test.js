import { contrastWCAG2, contrastTestWCAG2 } from "utils/color/wcag2";

describe("wcag2ContrastRatio", () => {
  it("should return WCAG 2 color contrast ratio for luminence values", () => {
    const actual = contrastWCAG2(0.36567143337890545, 0.6584736463746574);
    const expected = 1.7;
    expect(actual).toEqual(expected);
  });
  it("should return WCAG 2 color contrast ratio for black and white luminence values", () => {
    const actual = contrastWCAG2(0, 1);
    const expected = 21;
    expect(actual).toEqual(expected);
  });
  it("should return WCAG 2 color contrast ratio with 2 decimal places", () => {
    const actual = contrastWCAG2(0.36567143337890545, 0.7584736463746574);
    const expected = 1.94;
    expect(actual).toEqual(expected);
  });
});

describe("contrastTestWCAG2", () => {
  it("should pass large text AA", () => {
    expect(contrastTestWCAG2(3, "largeAA")).toEqual(true);
  });
  it("should fail large text AA", () => {
    expect(contrastTestWCAG2(2.9, "largeAA")).toEqual(false);
  });
  it("should pass small text AA", () => {
    expect(contrastTestWCAG2(4.5, "smallAA")).toEqual(true);
  });
  it("should fail small text AA", () => {
    expect(contrastTestWCAG2(4.4, "smallAA")).toEqual(false);
  });
  it("should pass large text AAA", () => {
    expect(contrastTestWCAG2(4.5, "largeAAA")).toEqual(true);
  });
  it("should fail large text AAA", () => {
    expect(contrastTestWCAG2(4.4, "largeAAA")).toEqual(false);
  });
  it("should pass small text AAA", () => {
    expect(contrastTestWCAG2(7, "smallAAA")).toEqual(true);
  });
  it("should fail small text AAA", () => {
    expect(contrastTestWCAG2(6.9, "smallAAA")).toEqual(false);
  });
});
