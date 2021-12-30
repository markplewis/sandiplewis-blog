import { contrastAPCA, contrastTestAPCA } from "utils/color/apca";

describe("contrastAPCA", () => {
  // Results: https://www.myndex.com/APCA/?BG=a1cdf7&TXT=0960c3&DEV=98G4g&BUF=APCA-G
  it("should return APCA color contrast ratio for luminence values", () => {
    const actual = contrastAPCA("#0960c3", "#a1cdf7");
    expect(actual).toEqual(48);
  });
  // Results: https://www.myndex.com/APCA/?BG=0960c3&TXT=a1cdf7&DEV=98G4g&BUF=APCA-G
  it("should return APCA color contrast ratio for luminence values", () => {
    const actual = contrastAPCA("#a1cdf7", "#0960c3");
    expect(actual).toEqual(50);
  });
  // Results: https://www.myndex.com/APCA/?BG=ffffff&TXT=000000&DEV=98G4g&BUF=APCA-G
  it("should return APCA color contrast ratio for black and white luminence values", () => {
    const actual = contrastAPCA("#000000", "#ffffff");
    expect(actual).toEqual(106);
  });
  // Results: https://www.myndex.com/APCA/?BG=000000&TXT=ffffff&DEV=98G4g&BUF=APCA-G
  it("should return APCA color contrast ratio for black and white luminence values", () => {
    const actual = contrastAPCA("#ffffff", "#000000");
    expect(actual).toEqual(108);
  });
});

describe("contrastTestAPCA", () => {
  it("should pass LC 45 (large text AA)", () => {
    expect(contrastTestAPCA(46, 0)).toEqual(true);
  });
  it("should fail LC 45 (large text AA)", () => {
    expect(contrastTestAPCA(44, 0)).toEqual(false);
  });
  it("should pass LC 60 (small text AA and large text AAA)", () => {
    expect(contrastTestAPCA(61, 1)).toEqual(true);
  });
  it("should fail LC 60 (small text AA and large text AAA)", () => {
    expect(contrastTestAPCA(59, 1)).toEqual(false);
  });
  it("should pass LC 75 (small text AAA)", () => {
    expect(contrastTestAPCA(76, 2)).toEqual(true);
  });
  it("should fail LC 75 (small text AAA)", () => {
    expect(contrastTestAPCA(74, 2)).toEqual(false);
  });
});
