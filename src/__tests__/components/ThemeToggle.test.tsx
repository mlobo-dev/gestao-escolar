import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ThemeToggle } from "../../components/ThemeToggle";
import { useThemeContext } from "../../context/ThemeContext";

// Mock the context
jest.mock("../../context/ThemeContext", () => ({
  useThemeContext: jest.fn(),
}));

describe("ThemeToggle", () => {
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useThemeContext as unknown as jest.Mock).mockReturnValue({
      colorScheme: "light",
      toggleTheme: mockToggleTheme,
    });
  });

  it("renders correctly in light mode", () => {
    const { getByTestId } = render(<ThemeToggle />);
    // The component uses Lucide icons which are rendered as SVG/Text
    expect(getByTestId("theme-toggle-button")).toBeTruthy();
  });

  it("renders correctly in dark mode", () => {
    (useThemeContext as unknown as jest.Mock).mockReturnValue({
      colorScheme: "dark",
      toggleTheme: mockToggleTheme,
    });
    const { getByTestId } = render(<ThemeToggle />);
    expect(getByTestId("theme-toggle-button")).toBeTruthy();
  });

  it("calls toggleTheme when pressed", () => {
    const { getByTestId } = render(<ThemeToggle />);
    const button = getByTestId("theme-toggle-button");

    fireEvent.press(button);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
