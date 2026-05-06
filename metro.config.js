const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// For web, we need to prioritize the browser field
if (process.env.EXPO_PUBLIC_PLATFORM === "web") {
  config.resolver.resolverMainFields = ["browser", "module", "main"];
}

config.resolver.blockList = [/etc\/.*/, /docs\/.*/];

module.exports = withNativeWind(config, { input: "./src/styles/global.css" });
