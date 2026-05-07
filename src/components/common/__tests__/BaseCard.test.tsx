import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";
import { BaseCard } from "../BaseCard";
import { useThemeContext } from "../../../context/ThemeContext";

// Mock the context
jest.mock("../../../context/ThemeContext", () => ({
  useThemeContext: jest.fn(),
}));

describe("BaseCard (Style Integrity)", () => {
  it("applies correct classes in light mode", () => {
    (useThemeContext as unknown as jest.Mock).mockReturnValue({ colorScheme: "light" });

    const { getByTestId } = render(
      <BaseCard testID="card-container">
        <Text>Content</Text>
      </BaseCard>
    );

    const card = getByTestId("card-container");
    expect(card.props.className).toContain("bg-white");
    expect(card.props.className).toContain("border-slate-100");
  });

  it("applies correct classes in dark mode", () => {
    (useThemeContext as unknown as jest.Mock).mockReturnValue({ colorScheme: "dark" });

    const { getByTestId } = render(
      <BaseCard testID="card-container">
        <Text>Content</Text>
      </BaseCard>
    );

    const card = getByTestId("card-container");
    expect(card.props.className).toContain("bg-card");
    expect(card.props.className).toContain("border-white/10");
  });
});
