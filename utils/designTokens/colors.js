const white = {
  hex: "#fff",
  r: 255,
  g: 255,
  b: 255,
  h: 0,
  s: 0,
  l: 100
};

const black = {
  hex: "#333",
  r: 51,
  g: 51,
  b: 51,
  h: 0,
  s: 0,
  l: 20
};

function generateCSSValues(color) {
  return {
    ...color,
    hsl: `hsl(${color.h}deg, ${color.s}%, ${color.l}%)`,
    rgb: `rgb(${color.r}, ${color.g}, ${color.b})`
  };
}

export const colors = {
  white: generateCSSValues(white),
  black: generateCSSValues(black)
};
