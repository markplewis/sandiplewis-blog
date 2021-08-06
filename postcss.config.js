// See: https://nextjs.org/docs/advanced-features/customizing-postcss-config
// And: https://nextjs.org/docs/basic-features/built-in-css-support

module.exports = {
  plugins: [
    [
      "postcss-pxtorem",
      {
        propList: ["*"],
        mediaQuery: true,
        minPixelValue: 2
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
