import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SchoolListScreen } from "../screens/SchoolListScreen";
import { useSchools } from "../../../hooks/useSchools";

const mockSchools = [
  { id: "1", name: "School 1", address: "Address 1", countClasses: 3 },
  { id: "2", name: "School 2", address: "Address 2", countClasses: 5 },
];

jest.mock("../../../hooks/useSchools", () => ({
  useSchools: jest.fn(() => ({
    schools: mockSchools,
    totalSchools: 2,
    isLoading: false,
    fetchSchools: jest.fn(),
  })),
}));

jest.mock("../../../context/ThemeContext", () => ({
  useThemeContext: jest.fn(() => ({
    colorScheme: "light",
  })),
}));

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  Stack: {
    Screen: () => null,
  },
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe("SchoolListScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the list of schools and their class counts", () => {
    const { getByText } = render(<SchoolListScreen />);
    expect(getByText("School 1")).toBeTruthy();
    expect(getByText(/3 class/i)).toBeTruthy();
    expect(getByText("School 2")).toBeTruthy();
    expect(getByText(/5 class/i)).toBeTruthy();
  });

  it("navigates to school details on press", () => {
    const { getByText } = render(<SchoolListScreen />);
    fireEvent.press(getByText("School 1"));
    expect(mockPush).toHaveBeenCalledWith("/school/1");
  });

  it("navigates to new school screen", () => {
    const { getByTestId } = render(<SchoolListScreen />);
    fireEvent.press(getByTestId("add-school-button"));
    expect(mockPush).toHaveBeenCalledWith("/school/new");
  });
});
