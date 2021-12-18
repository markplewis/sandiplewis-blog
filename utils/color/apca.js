import { APCAcontrast, colorParsley, sRGBtoY } from "apca-w3";

export function contrastAPCA(fgColorHex, bgColorHex) {
  return Math.abs(
    APCAcontrast(sRGBtoY(colorParsley(fgColorHex)), sRGBtoY(colorParsley(bgColorHex)))
  );
}

// https://github.com/Myndex/SAPC-APCA/blob/master/JS/ReadMe.md
// https://github.com/Myndex/SAPC-APCA
// https://github.com/Myndex/apca-w3
// https://twitter.com/DanHollick/status/1468958644364402702?s=20
//
// For simplicity, you can also use the "simple key levels" method (Lc 45, 60, 75), which compares to WCAG 2 contrast (with one very light color) as:

// Progressively more strict
const contrastRatios = [
  45, // Lc 45 is "sort of" like 3:1 (AA large text)
  60, // Lc 60 is "sort of" like 4.5:1 (AA small text and AAA large text)
  70 // Lc 75 is "sort of" like 7:1 (AAA small text)
];

export function contrastTestAPCA(contrast, level = 2) {
  return contrast >= contrastRatios[level];
}
