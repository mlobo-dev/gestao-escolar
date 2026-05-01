const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Prioritize browser fields for web compatibility
config.resolver.resolverMainFields = ["browser", "module", "main"];

module.exports = withNativeWind(config, { input: "./global.css" });
