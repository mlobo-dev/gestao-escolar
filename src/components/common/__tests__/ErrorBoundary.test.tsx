import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ErrorBoundary } from "../ErrorBoundary";
import { Text } from "react-native";

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test Error");
  }
  return <Text>Safe Content</Text>;
};

describe("ErrorBoundary component", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("should render children when no error occurs", () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Safe Content</Text>
      </ErrorBoundary>
    );
    expect(getByText("Safe Content")).toBeTruthy();
  });

  it("should render fallback UI when an error occurs", () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(getByText("Ops! Algo deu errado")).toBeTruthy();
  });

  it("should reset state when 'Reiniciar App' is pressed", () => {
    const { getByText, queryByText, rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText("Ops! Algo deu errado")).toBeTruthy();

    // Fix the throwing condition before resetting
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    fireEvent.press(getByText("Reiniciar App"));

    expect(getByText("Safe Content")).toBeTruthy();
    expect(queryByText("Ops! Algo deu errado")).toBeNull();
  });
});
