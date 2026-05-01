const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Prioritize CJS to avoid import.meta issues in some libraries like Zustand
config.resolver.resolverMainFields = ["main", "module", "browser"];

module.exports = withNativeWind(config, { input: "./global.css" });
