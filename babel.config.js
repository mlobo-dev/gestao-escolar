module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "transform-define",
        {
          "import.meta.env": "process.env",
          "import.meta.url": "undefined",
        },
      ],
      "transform-import-meta",
      "@babel/plugin-transform-class-static-block",
    ],
  };
};
