import { luminance } from "utils/color/conversion";

const white = {
  hex: "#ffffff",
  r: 255,
  g: 255,
  b: 255,
  h: 0,
  s: 0,
  l: 100
};

const darkGray = {
  hex: "#333333",
  r: 51,
  g: 51,
  b: 51,
  h: 0,
  s: 0,
  l: 20
};

function addLuminenceProperty(color) {
  return {
    ...color,
    hsl: `hsl(${color.h}deg, ${color.s}%, ${color.l}%)`,
    luminance: luminance(color.r, color.g, color.b)
  };
}

export const colorTokens = {
  white: addLuminenceProperty(white),
  darkGray: addLuminenceProperty(darkGray)
};
