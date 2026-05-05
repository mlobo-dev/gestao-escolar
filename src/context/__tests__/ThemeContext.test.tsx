import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import { ThemeProvider, useThemeContext } from "../ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("ThemeContext", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  it("should have initial state light", async () => {
    const { result } = renderHook(() => useThemeContext(), { wrapper });
    
    expect(result.current.colorScheme).toBe("light");
  });

  it("should toggle theme from light to dark", async () => {
    const { result } = renderHook(() => useThemeContext(), { wrapper });

    await act(async () => {
      result.current.toggleTheme();
    });

    expect(result.current.colorScheme).toBe("dark");
  });

  it("should toggle theme from dark to light", async () => {
    const { result } = renderHook(() => useThemeContext(), { wrapper });

    // Set to dark first
    await act(async () => {
      result.current.setTheme("dark");
    });
    expect(result.current.colorScheme).toBe("dark");

    // Toggle back to light
    await act(async () => {
      result.current.toggleTheme();
    });
    expect(result.current.colorScheme).toBe("light");
  });

  it("should set theme directly", async () => {
    const { result } = renderHook(() => useThemeContext(), { wrapper });

    await act(async () => {
      result.current.setTheme("dark");
    });
    expect(result.current.colorScheme).toBe("dark");
    
    await act(async () => {
      result.current.setTheme("light");
    });
    expect(result.current.colorScheme).toBe("light");
  });
});
