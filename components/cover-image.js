import cn from 'classnames'
import Link from 'next/link'
import { imageBuilder } from '../lib/sanity'

import swatchStyles from './cover-image-styles.module.css'

// See: https://css-tricks.com/converting-color-spaces-in-javascript/#hex-to-hsl
// https://www.sarasoueidan.com/blog/hex-rgb-to-hsl/#hsl-and-color-harmonies
// https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o

function hexToRGB(H) {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  return {r, g, b};
}

function hexToHSL(H) {
  let {r, g, b} = hexToRGB(H);
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

  if (delta == 0)
    h = 0;
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  else if (cmax == g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0)
    h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return {h, s, l}
}

function luminance(r, g, b) {
  var a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928
          ? v / 12.92
          : Math.pow( (v + 0.055) / 1.055, 2.4 );
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrastRatio(bgLuminance, fgLuminance) {
  return bgLuminance > fgLuminance
    ? ((fgLuminance + 0.05) / (bgLuminance + 0.05))
    : ((bgLuminance + 0.05) / (fgLuminance + 0.05));
}

export default function CoverImage({ title, url, imageObject, imageMeta, slug }) {
  // This works!
  // console.log("imageObject", imageObject);
  // console.log("imageMeta", imageMeta);
  const palette = imageMeta?.metadata?.palette;
  // console.log("palette", palette);

  const paletteKeys = ["vibrant", "darkVibrant", "lightVibrant"];

  const paletteData = paletteKeys.map(key => {
    if (!palette || !palette[key]) {
      return null;
    }
    const titleRGB = hexToRGB(palette[key].title);
    const bgRGB = hexToRGB(palette[key].background);
    const fgRGB = hexToRGB(palette[key].foreground);

    // calculate the relative luminance
    const titleLuminance = luminance(titleRGB.r, titleRGB.g, titleRGB.b);
    const bgLuminance = luminance(bgRGB.r, bgRGB.g, bgRGB.b);
    const fgLuminance = luminance(fgRGB.r, fgRGB.g, fgRGB.b);

    // const bgRatio = bgLuminance > titleLuminance 
    // ? ((titleLuminance + 0.05) / (bgLuminance + 0.05))
    // : ((bgLuminance + 0.05) / (titleLuminance + 0.05));
    
    // const fgRatio = titleLuminance > fgLuminance 
    // ? ((fgLuminance + 0.05) / (titleLuminance + 0.05))
    // : ((titleLuminance + 0.05) / (fgLuminance + 0.05));

    const bgHSL = hexToHSL(palette[key].background);

    return {
      key,
      title: {
        ...hexToHSL(palette[key].title),
        luminance: titleLuminance
      },
      bg: {
        ...bgHSL,
        luminance: bgLuminance
      },
      bgComplimentary: {
        h: bgHSL.h - 180,
        s: bgHSL.s,
        l: bgHSL.l
      },
      fg: {
        ...hexToHSL(palette[key].foreground),
        luminance: fgLuminance
      }
      // bgRatio: Math.round((bgRatio + Number.EPSILON) * 100) / 100,
      // fgRatio: Math.round((fgRatio + Number.EPSILON) * 100) / 100
    };
  }).filter(obj => obj);

  const swatches = paletteData.map(({key, title, bg, bgComplimentary, fg}) => {
    // const bgRatio = contrastRatio(bg.luminance, title.luminance);
    const bgRatio = contrastRatio(bg.luminance, fg.luminance);
    return (
      <div className={swatchStyles.swatchGroup} key={key}>
        <p>{key}</p>
        <p>
          AA-level large text: {bgRatio < 1/3 ? 'PASS' : 'FAIL' }<br />
          AA-level small text: {bgRatio < 1/4.5 ? 'PASS' : 'FAIL' }<br />
          AAA-level large text: {bgRatio < 1/4.5 ? 'PASS' : 'FAIL' }<br />
          AAA-level small text: {bgRatio < 1/7 ? 'PASS' : 'FAIL' }
        </p>

        <div className={swatchStyles.swatch} style={{
          backgroundColor: `hsl(${bg.h}deg, ${bg.s}%, ${bg.l}%)`,
          color: `hsl(${fg.h}deg, ${fg.s}%, ${fg.l}%)`
          // color: `hsl(${title.h}deg, ${title.s}%, ${title.l}%)`
        }}>
          {/* TODO: calculate and display ratio instead of single number */}
          {Math.round((bgRatio + Number.EPSILON) * 100) / 100}
        </div>

        <div className={swatchStyles.swatch} style={{
          backgroundColor: `hsl(${bg.h - 180}deg, ${bg.s}%, ${bg.l}%)`
        }}></div>
      </div>
    );
  });

  const image = (
    <img
      width={1240}
      height={540}
      alt={imageObject.alt}
      className={cn('shadow-small', {
        'hover:shadow-medium transition-shadow duration-200': slug,
      })}
      src={imageBuilder(imageObject).width(1240).height(540).url()}
    />
  );

  const imageWrapped = palette ? (
    <div>
      {image}
      <div>{swatches}</div>
    </div>
  ) : image;

  return (
    <div className="-mx-5 sm:mx-0">
      {slug ? (
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          <a aria-label={title}>{imageWrapped}</a>
        </Link>
      ) : (
        imageWrapped
      )}
    </div>
  )
}
