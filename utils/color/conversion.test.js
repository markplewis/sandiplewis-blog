import {
  hexToHSL,
  hexToLongHex,
  hexToNumber,
  hexToRGB,
  HSLToRGB,
  luminance,
  RGBToHex
} from "utils/color/conversion";

describe("hexToHSL", () => {
  it("should return HSL values for hex color", () => {
    expect(hexToHSL("#58a6ff")).toEqual({ h: 212, s: 100, l: 67.3 });
  });
});

describe("hexToLongHex", () => {
  it("should return long version of hex color", () => {
    expect(hexToLongHex("#fc0")).toEqual("#ffcc00");
  });
});

describe("hexToNumber", () => {
  it("should return number value for hex color", () => {
    expect(hexToNumber("#58a6ff")).toEqual(5809919);
  });
});

describe("hexToRGB", () => {
  it("should return RGB value for hex color", () => {
    expect(hexToRGB("#58a6ff")).toEqual({ r: 88, g: 166, b: 255 });
  });
});

describe("HSLToRGB", () => {
  it("should return HSL values for RGB color", () => {
    expect(HSLToRGB(212, 100, 67)).toEqual({ r: 87, g: 165, b: 255 });
  });
});

describe("luminance", () => {
  it("should return luminance value for RGB color", () => {
    expect(luminance(88, 166, 255)).toEqual(0.36567143337890545);
  });
  it("should return luminance value for black", () => {
    expect(luminance(0, 0, 0)).toEqual(0);
  });
  it("should return luminance value for white", () => {
    expect(luminance(255, 255, 255)).toEqual(1);
  });
});

describe("RGBToHex", () => {
  it("should return hex value for RGB color", () => {
    expect(RGBToHex(88, 166, 255)).toEqual("#58a6ff");
  });
});
