// See: https://nextjs.org/docs/advanced-features/customizing-postcss-config
// And: https://nextjs.org/docs/basic-features/built-in-css-support

module.exports = {
  plugins: [
    [
      "postcss-pxtorem",
      {
        propList: ["*"],
        mediaQuery: true
        // Since preserving `1px` values in an attempt to mitigate sub-pixel rendering issues
        // in rules like `border: 1px` doesn't work in all browsers, perhaps we should use
        // `border: thin` instead? See: https://chenhuijing.com/blog/about-subpixel-rendering-in-browsers/
        // Also, sub-pixel rendering inconsistencies affect more than just borders and text:
        // https://stackoverflow.com/questions/34676263/sub-pixels-calculated-and-rendered-differently-among-browsers
        // https://www.reddit.com/r/css/comments/977fmv/pseudoelement_moves_by_1px_off_center_on_various/e468g9m/
        // https://medium.com/kajabi-ux/css-and-sub-pixel-rendering-the-case-of-the-clipped-border-4652c5a1b5ab
        // Someday this will be solved with the CSS `round()` function:
        // https://www.w3.org/TR/css-values-4/#round-func
        // minPixelValue: 2
      }
    ],
    "postcss-flexbugs-fixes",
    [
      "postcss-preset-env",
      {
        autoprefixer: {
          flexbox: "no-2009"
        },
        stage: 3,
        features: {
          "custom-properties": false
        }
      }
    ]
  ]
};
