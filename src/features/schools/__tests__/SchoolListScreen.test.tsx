import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import { SchoolListScreen } from "../screens/SchoolListScreen";
import { useSchools } from "../../../hooks/useSchools";

const mockSchools = [
  { id: "1", name: "School 1", address: "Address 1", countClasses: 3 },
  { id: "2", name: "School 2", address: "Address 2", countClasses: 5 },
];

jest.mock("../../../hooks/useSchools", () => ({
  useSchools: jest.fn(),
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
    t: (str: string, options?: any) => {
      if (str === "class") return "classes";
      return str;
    },
  }),
}));

describe("SchoolListScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSchools as jest.Mock).mockReturnValue({
      schools: mockSchools,
      totalSchools: 2,
      isLoading: false,
      fetchSchools: jest.fn(),
    });
  });

  it("renders the list of schools and their class counts", () => {
    const { getByText } = render(<SchoolListScreen />);
    expect(getByText("School 1")).toBeTruthy();
    expect(getByText(/3/)).toBeTruthy();
    expect(getByText("School 2")).toBeTruthy();
    expect(getByText(/5/)).toBeTruthy();
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

  it("shows search results on search query change", () => {
    (useSchools as jest.Mock).mockReturnValue({
      schools: [mockSchools[0]],
      totalSchools: 1,
      isLoading: false,
      fetchSchools: jest.fn(),
    });

    const { getByPlaceholderText, getByText, queryByText } = render(
      <SchoolListScreen />
    );
    const searchInput = getByPlaceholderText("search");
    fireEvent.changeText(searchInput, "School 1");

    expect(getByText("School 1")).toBeTruthy();
    expect(queryByText("School 2")).toBeNull();
  });

  it("shows empty state when no schools found", () => {
    (useSchools as jest.Mock).mockReturnValue({
      schools: [],
      totalSchools: 0,
      isLoading: false,
      fetchSchools: jest.fn(),
    });

    const { getByText } = render(<SchoolListScreen />);
    expect(getByText("no_schools")).toBeTruthy();
  });
});
