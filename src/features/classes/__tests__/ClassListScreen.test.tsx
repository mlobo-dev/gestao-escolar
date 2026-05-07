import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react-native";
import { ClassListScreen } from "../screens/ClassListScreen";
import { useClasses } from "../../../hooks/useClasses";
import { useSchools } from "../../../hooks/useSchools";

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (str: string, options?: any) => {
      if (options?.name) return `${str} ${options.name}`;
      return str;
    },
    i18n: { changeLanguage: jest.fn() },
  }),
}));

const mockClasses = [
  {
    id: "c1",
    name: "Math A",
    shift: "Morning",
    academicYear: "2024",
    schoolId: "1",
  },
];

const mockSchools = [
  { id: "1", name: "Escola 1", address: "Rua 1", countClasses: 1 },
];

jest.mock("../../../hooks/useClasses", () => ({
  useClasses: jest.fn(),
}));

jest.mock("../../../hooks/useSchools", () => ({
  useSchools: jest.fn(),
}));

jest.mock("../../../context/ThemeContext", () => ({
  useThemeContext: jest.fn(() => ({
    colorScheme: "light",
  })),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    canGoBack: () => true,
    replace: mockReplace,
  }),
  useLocalSearchParams: () => ({ id: "1" }),
  Stack: {
    Screen: () => null,
  },
}));

describe("ClassListScreen", () => {
  const deleteClass = jest.fn();
  const deleteSchool = jest.fn();
  const fetchClasses = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useClasses as jest.Mock).mockReturnValue({
      classes: mockClasses,
      fetchClasses,
      deleteClass,
      isLoading: false,
      isLoadingMore: false,
      hasMoreClasses: false,
    });
    (useSchools as jest.Mock).mockReturnValue({
      allSchools: mockSchools,
      deleteSchool,
    });
  });

  it("renders school information and classes", () => {
    const { getByText } = render(<ClassListScreen />);
    expect(getByText("Escola 1")).toBeTruthy();
    expect(getByText("Rua 1")).toBeTruthy();
    expect(getByText("Math A")).toBeTruthy();
  });

  it("navigates to add class", () => {
    const { getByTestId } = render(<ClassListScreen />);
    fireEvent.press(getByTestId("add-class-button"));
    expect(mockPush).toHaveBeenCalledWith("/school/1/class/new");
  });

  it("shows empty state when no classes found", () => {
    (useClasses as jest.Mock).mockReturnValue({
      classes: [],
      fetchClasses,
      deleteClass,
      isLoading: false,
      isLoadingMore: false,
      hasMoreClasses: false,
    });
    const { getByText } = render(<ClassListScreen />);
    expect(getByText("no_classes")).toBeTruthy();
  });
});
