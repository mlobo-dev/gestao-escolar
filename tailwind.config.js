/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Premium Midnight Navy & Emerald Palette (Hardcoded for stability)
        background: "#020617", // Slate 950
        foreground: "#f8fafc", // Slate 50
        card: "#0f172a",       // Slate 900
        "card-foreground": "#f8fafc",
        primary: {
          DEFAULT: "#10b981",  // Emerald 500
          foreground: "#020617",
        },
        muted: {
          DEFAULT: "#1e293b",  // Slate 800
          foreground: "#94a3b8", // Slate 400
        },
        border: "#1e293b",
        input: "#1e293b",
      },
      fontFamily: {
        sans: ["Outfit_400Regular"],
        bold: ["Outfit_700Bold"],
        semibold: ["Outfit_600SemiBold"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
};
