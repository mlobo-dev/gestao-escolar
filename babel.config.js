module.exports = function (api) {
  api.cache(true);
  const isTest = process.env.NODE_ENV === "test";

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      // Only include nativewind/babel if not in test mode to avoid Jest compatibility issues
      ...(isTest ? [] : ["nativewind/babel"]),
    ],
    plugins: [
      [
        "babel-plugin-transform-define",
        {
          "import.meta.env": "process.env",
          "import.meta.url": "undefined",
        },
      ],
      "babel-plugin-transform-import-meta",
      "@babel/plugin-transform-class-static-block",
      [
        "module-resolver",
        {
          alias: {
            "@": "./src",
            "../../../packages/react-native-worklets-stub": "react-native-worklets",
          },
        },
      ],
      // In Reanimated 4, the reanimated plugin already handles worklets transformation.
      // Including both causes a "Duplicate plugin" error.
      "react-native-reanimated/plugin",
    ],
  };
};
