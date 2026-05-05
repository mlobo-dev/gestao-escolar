import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeContextType {
  colorScheme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "theme-storage";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorScheme, setColorSchemeState] = useState<"light" | "dark">("light");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedTheme) {
          const { state } = JSON.parse(savedTheme);
          setColorSchemeState(state.colorScheme || "light");
        }
      } catch (e) {
        console.error("Failed to load theme", e);
      }
    };
    loadTheme();
  }, []);

  const setTheme = useCallback(async (theme: "light" | "dark") => {
    setColorSchemeState(theme);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { colorScheme: theme } }));
    } catch (e) {
      console.error("Failed to save theme", e);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = colorScheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  }, [colorScheme, setTheme]);

  const value = useMemo(() => ({
    colorScheme,
    toggleTheme,
    setTheme,
  }), [colorScheme, toggleTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
