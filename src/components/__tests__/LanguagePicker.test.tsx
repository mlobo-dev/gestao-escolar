import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Force use of actual component despite global mock in jest.setup.js
const { LanguagePicker } = jest.requireActual("../LanguagePicker");

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

// Manual mock for reanimated to avoid worklets initialization error
jest.mock("react-native-reanimated", () => {
  const React = require("react");
  const View = require("react-native").View;
  
  const MockView = ({ children, style, ...props }: any) => React.createElement(View, { ...props, style }, children);
  MockView.displayName = "Animated.View";

  const Reanimated = {
    useSharedValue: (val: any) => ({ value: val }),
    useAnimatedStyle: (cb: any) => cb(),
    withSpring: (val: any) => val,
    withSequence: (...args: any[]) => args[0],
    withTiming: (val: any, config: any, cb: any) => {
      if (cb) cb(true);
      return val;
    },
    View: MockView,
  };

  return {
    ...Reanimated,
    default: Reanimated,
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
