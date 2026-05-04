import React from "react";
import { TouchableOpacity } from "react-native";
import { Sun, Moon } from "lucide-react-native";
import { useThemeStore } from "../store/useThemeStore";

export function ThemeToggle() {
  const { colorScheme, toggleTheme } = useThemeStore();
  const isDark = colorScheme === "dark";

  return (
    <TouchableOpacity
      onPress={() => {
        toggleTheme();
      }}
      activeOpacity={0.7}
      className="w-10 h-10 bg-white/10 border border-white/10 rounded-xl items-center justify-center active:bg-white/20"
    >
      {isDark ? (
        <Moon size={22} color="#6366f1" />
      ) : (
        <Sun size={22} color="#fbbf24" />
      )}
    </TouchableOpacity>
  );
}
