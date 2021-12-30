import { contrastWCAG2, contrastTestWCAG2 } from "utils/color/wcag2";

describe("contrastWCAG2", () => {
  it("should return WCAG 2 color contrast ratio for luminence values", () => {
    const actual = contrastWCAG2(0.36567143337890545, 0.6584736463746574);
    expect(actual).toEqual(1.7);
  });
  it("should return WCAG 2 color contrast ratio for black and white luminence values", () => {
    const actual = contrastWCAG2(0, 1);
    expect(actual).toEqual(21);
  });
  it("should return WCAG 2 color contrast ratio with 2 decimal places", () => {
    const actual = contrastWCAG2(0.36567143337890545, 0.7584736463746574);
    expect(actual).toEqual(1.94);
  });
});

describe("contrastTestWCAG2", () => {
  it("should pass large text AA", () => {
    expect(contrastTestWCAG2(3, 0)).toEqual(true);
  });
  it("should fail large text AA", () => {
    expect(contrastTestWCAG2(2.9, 0)).toEqual(false);
  });
  it("should pass small text AA and large text AAA", () => {
    expect(contrastTestWCAG2(4.5, 1)).toEqual(true);
  });
  it("should fail small text AA and large text AAA", () => {
    expect(contrastTestWCAG2(4.4, 1)).toEqual(false);
  });
  it("should pass small text AAA", () => {
    expect(contrastTestWCAG2(7, 2)).toEqual(true);
  });
  it("should fail small text AAA", () => {
    expect(contrastTestWCAG2(6.9, 2)).toEqual(false);
  });
});
