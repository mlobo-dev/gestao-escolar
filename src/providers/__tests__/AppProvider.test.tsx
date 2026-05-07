import React from "react";
import { render } from "@testing-library/react-native";
import { AppProvider } from "../AppProvider";
import { Text } from "react-native";

// Mocking dependencies to avoid deep tree rendering issues
jest.mock("@gluestack-ui/nativewind", () => ({
  GluestackUIProvider: ({ children }: any) => children,
}));

jest.mock("@/context/AuthContext", () => ({
  AuthProvider: ({ children }: any) => children,
}));

jest.mock("@/context/ThemeContext", () => ({
  ThemeProvider: ({ children }: any) => children,
}));

jest.mock("@/context/SchoolContext", () => ({
  SchoolProvider: ({ children }: any) => children,
}));

describe("AppProvider component", () => {
  it("should render children with all providers", () => {
    const { getByText } = render(
      <AppProvider>
        <Text>Root Content</Text>
      </AppProvider>
    );
    expect(getByText("Root Content")).toBeTruthy();
  });
});
