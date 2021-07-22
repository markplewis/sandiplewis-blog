import Image from "next/image";
import Link from "next/link";
import { imageBuilder } from "lib/sanity";
import { hexToRGB, hexToHSL, HSLToRGB, luminance, contrastRatio } from "utils/color";

import swatchStyles from "components/cover-image-styles.module.css";

const blackLuminance = luminance(0, 0, 0);
const whiteLuminance = luminance(255, 255, 255);

export default function CoverImage({ title, imageObject, imageMeta, slug }) {
  const palette = imageMeta?.metadata?.palette;
  const paletteKeys = ["vibrant", "darkVibrant", "lightVibrant"];

  const paletteData = paletteKeys
    .map(key => {
      if (!palette || !palette[key]) {
        return null;
      }
      const bgHSL = hexToHSL(palette[key].background);
      const bgRGB = hexToRGB(palette[key].background);
      const bgLuminance = luminance(bgRGB.r, bgRGB.g, bgRGB.b);

      // Complimentary colour
      const bgCompHSL = {
        h: bgHSL.h - 180,
        s: bgHSL.s,
        l: bgHSL.l
      };
      const bgCompRGB = HSLToRGB(...Object.values(bgCompHSL));
      const bgCompLuminance = luminance(...Object.values(bgCompRGB));

      return {
        key,
        bg: {
          ...bgHSL,
          luminance: bgLuminance
        },
        bgComp: {
          ...bgCompHSL,
          luminance: bgCompLuminance
        }
      };
    })
    .filter(obj => obj);

  const swatches = paletteData.map(({ key, bg, bgComp }) => {
    // Black
    const { float: bgFloatBlack, ratio: bgRatioBlack } = contrastRatio(
      bg.luminance,
      blackLuminance
    );
    const { float: bgCompFloatBlack, ratio: bgCompRatioBlack } = contrastRatio(
      bgComp.luminance,
      blackLuminance
    );
    // White
    const { float: bgFloatWhite, ratio: bgRatioWhite } = contrastRatio(
      bg.luminance,
      whiteLuminance
    );
    const { float: bgCompFloatWhite, ratio: bgCompRatioWhite } = contrastRatio(
      bgComp.luminance,
      whiteLuminance
    );
    const pass = <span style={{ color: "green" }}>PASS</span>;
    const fail = <span style={{ color: "red" }}>FAIL</span>;

    const stats = (num, base = true) => {
      return (
        <p>
          <strong>{base ? "Base" : "Complimentary"}</strong>
          <br />
          AA lg (3:1) {num < 1 / 3 ? pass : fail}
          <br />
          AA sm (4.5:1) {num < 1 / 4.5 ? pass : fail}
          <br />
          AAA lg (4.5:1) {num < 1 / 4.5 ? pass : fail}
          <br />
          AAA sm (7:1) {num < 1 / 7 ? pass : fail}
        </p>
      );
    };

    const testResults = num => {
      return [num < 1 / 3, num < 1 / 4.5, num < 1 / 4.5, num < 1 / 7].filter(v => v);
    };

    const baseBgColor = `hsl(${bg.h}deg, ${bg.s}%, ${bg.l}%)`;
    const compBgColor = `hsl(${bgComp.h}deg, ${bgComp.s}%, ${bgComp.l}%)`;

    const baseBlackWins = testResults(bgFloatBlack).length > testResults(bgFloatWhite).length;
    const compBlackWins =
      testResults(bgCompFloatBlack).length > testResults(bgCompFloatWhite).length;

    return (
      <div key={key}>
        <p>
          <strong>{key}</strong>
        </p>

        {/* Black text on base background colour */}
        <div className={`${swatchStyles.swatchGroup} ${baseBlackWins ? swatchStyles.winner : ""}`}>
          <div
            className={swatchStyles.swatch}
            style={{
              backgroundColor: baseBgColor,
              color: "black"
            }}>
            {bgRatioBlack}
          </div>
          {stats(bgFloatBlack)}
        </div>

        {/* White text on base background colour */}
        <div className={`${swatchStyles.swatchGroup} ${baseBlackWins ? "" : swatchStyles.winner}`}>
          <div
            className={swatchStyles.swatch}
            style={{
              backgroundColor: baseBgColor,
              color: "white"
            }}>
            {bgRatioWhite}
          </div>
          {stats(bgFloatWhite)}
        </div>

        {/* Black text on complimentary background colour */}
        <div className={`${swatchStyles.swatchGroup} ${compBlackWins ? swatchStyles.winner : ""}`}>
          <div
            className={swatchStyles.swatch}
            style={{
              backgroundColor: compBgColor,
              color: "black"
            }}>
            {bgCompRatioBlack}
          </div>
          {stats(bgCompFloatBlack, false)}
        </div>

        {/* White text on complimentary background colour */}
        <div className={`${swatchStyles.swatchGroup} ${compBlackWins ? "" : swatchStyles.winner}`}>
          <div
            className={swatchStyles.swatch}
            style={{
              backgroundColor: compBgColor,
              color: "white"
            }}>
            {bgCompRatioWhite}
          </div>
          {stats(bgCompFloatWhite, false)}
        </div>
      </div>
    );
  });

  // See: https://nextjs.org/docs/api-reference/next/image
  // Can't produce <picture> elements (no art direction)
  const image = (
    <Image
      src={imageBuilder(imageObject).width(1240).height(540).url()}
      width={1240}
      height={540}
      sizes="(max-width: 800px) 100vw, 800px"
      layout="responsive"
      alt={imageObject.alt}
      quality={75}
      priority={false}
      placeholder="blur"
      // Data URL generated here: https://png-pixel.com/
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
    />
  );

  return (
    <div className="-mx-5 sm:mx-0">
      {slug ? (
        <>
          <Link as={`/posts/${slug}`} href="/posts/[slug]">
            <a aria-label={title}>{image}</a>
          </Link>
          <div>{swatches}</div>
        </>
      ) : (
        <>
          {image}
          <div>{swatches}</div>
        </>
      )}
    </div>
  );
}
