import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { useTranslation } from "react-i18next";

// Force use of actual component despite global mock in jest.setup.js
const { LanguagePicker } = jest.requireActual("../LanguagePicker");

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

// Manual mock for reanimated to avoid worklets initialization error
jest.mock("react-native-reanimated", () => {
  return {
    useSharedValue: (val: any) => ({ value: val }),
    useAnimatedStyle: (cb: any) => cb(),
    withSpring: (val: any) => val,
    withSequence: (...args: any[]) => args[0],
    withTiming: (val: any, config: any, cb: any) => {
      if (cb) cb(true);
      return val;
    },
    default: {
      View: "View",
    },
  };
});

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

  it("should render correctly with PT flag", () => {
    const { getByText } = render(<LanguagePicker />);
    expect(getByText("🇧🇷")).toBeTruthy();
  });

  it("should render correctly with EN flag", () => {
    (useTranslation as jest.Mock).mockReturnValue({
      i18n: {
        language: "en",
        changeLanguage: mockChangeLanguage,
      },
    });
    const { getByText } = render(<LanguagePicker />);
    expect(getByText("🇺🇸")).toBeTruthy();
  });

  it("should call changeLanguage when pressed", () => {
    const { getByText } = render(<LanguagePicker />);
    fireEvent.press(getByText("🇧🇷"));
    expect(mockChangeLanguage).toHaveBeenCalledWith("en");
  });
});
