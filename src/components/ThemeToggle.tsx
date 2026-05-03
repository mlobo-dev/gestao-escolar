import React from "react";
import { TouchableOpacity } from "react-native";
import { Sun, Moon } from "lucide-react-native";
import { useColorScheme } from "nativewind";

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <TouchableOpacity
      onPress={toggleColorScheme}
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
