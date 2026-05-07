import React from "react";
import { render } from "@testing-library/react-native";
import { SearchInput } from "../SearchInput";
import { ThemeProvider } from "../../../context/ThemeContext";

describe("SearchInput component", () => {
  it("renders correctly in light mode", () => {
    const { getByPlaceholderText } = render(
      <ThemeProvider initialValue="light">
        <SearchInput placeholder="Search..." />
      </ThemeProvider>
    );
    expect(getByPlaceholderText("Search...")).toBeTruthy();
  });

  it("renders correctly in dark mode", () => {
    const { getByPlaceholderText } = render(
      <ThemeProvider initialValue="dark">
        <SearchInput placeholder="Search..." />
      </ThemeProvider>
    );
    expect(getByPlaceholderText("Search...")).toBeTruthy();
  });

  it("applies custom container styles", () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <SearchInput testID="search-container" containerClassName="custom-style" />
      </ThemeProvider>
    );
    const container = getByTestId("search-container");
    expect(container.props.className).toContain("custom-style");
  });
});
