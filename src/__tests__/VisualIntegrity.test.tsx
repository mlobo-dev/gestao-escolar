import React from "react";
import { render } from "@testing-library/react-native";
import { SearchInput } from "../components/common/SearchInput";
import { ThemeToggle } from "../components/ThemeToggle";
import { useThemeContext } from "../context/ThemeContext";

// Mock dependencies
jest.mock("../context/ThemeContext", () => ({
  useThemeContext: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "pt", changeLanguage: jest.fn() },
  }),
}));

// We skip LanguagePicker in this file because of global mocking in jest.setup.js
// but we can test SearchInput and ThemeToggle which are now refactored for style integrity.

describe("UI Visual Integrity Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("SearchInput Styling", () => {
    it("applies correct background and border in light mode", () => {
      (useThemeContext as unknown as jest.Mock).mockReturnValue({ colorScheme: "light" });
      const { getByTestId } = render(<SearchInput testID="search-input" />);
      const container = getByTestId("search-input");
      
      expect(container.props.className).toContain("bg-white");
      expect(container.props.className).toContain("border-slate-200");
    });

    it("applies correct background and border in dark mode", () => {
      (useThemeContext as unknown as jest.Mock).mockReturnValue({ colorScheme: "dark" });
      const { getByTestId } = render(<SearchInput testID="search-input" />);
      const container = getByTestId("search-input");
      
      expect(container.props.className).toContain("bg-white/5");
      expect(container.props.className).toContain("border-white/10");
    });
  });

  describe("ThemeToggle Styling", () => {
    it("has consistent base styling", () => {
      (useThemeContext as unknown as jest.Mock).mockReturnValue({ colorScheme: "light" });
      const { getByTestId } = render(<ThemeToggle />);
      const container = getByTestId("theme-toggle-container");
      
      expect(container.props.className).toContain("bg-white/10");
      expect(container.props.className).toContain("rounded-xl");
    });
  });
});
