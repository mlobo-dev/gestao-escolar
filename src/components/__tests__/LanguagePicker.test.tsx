import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Force use of actual component despite global mock in jest.setup.js
const { LanguagePicker } = jest.requireActual("../LanguagePicker");

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

describe("LanguagePicker component", () => {
  const mockChangeLanguage = jest.fn();

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      i18n: {
        language: "pt",
        changeLanguage: mockChangeLanguage,
      },
    });
  });

  const renderComponent = () => 
    render(
      <SafeAreaProvider>
        <LanguagePicker />
      </SafeAreaProvider>
    );

  it("should render correctly with PT flag", () => {
    const { getByText } = renderComponent();
    expect(getByText("🇧🇷")).toBeTruthy();
  });

  it("should render correctly with EN flag", () => {
    (useTranslation as jest.Mock).mockReturnValue({
      i18n: {
        language: "en",
        changeLanguage: mockChangeLanguage,
      },
    });
    const { getByText } = renderComponent();
    expect(getByText("🇺🇸")).toBeTruthy();
  });

  it("should call changeLanguage when pressed", () => {
    const { getByText } = renderComponent();
    fireEvent.press(getByText("🇧🇷"));
    expect(mockChangeLanguage).toHaveBeenCalledWith("en");
  });
});
