import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SchoolDetailsScreen from "../../../app/school/[id]/index";
import { useSchoolStore } from "../../store/useSchoolStore";

jest.mock("../../store/useSchoolStore", () => ({
  useSchoolStore: jest.fn(),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    canGoBack: () => true,
  }),
  useLocalSearchParams: () => ({ id: "1" }),
  Stack: {
    Screen: () => null,
  },
}));

describe("SchoolDetailsScreen", () => {
  const mockSchool = { id: "1", name: "Test School", address: "Test Address" };
  const mockClasses = [{ id: "c1", name: "Class 1", shift: "Morning", academicYear: "2024" }];

  beforeEach(() => {
    jest.clearAllMocks();
    (useSchoolStore as unknown as jest.Mock).mockReturnValue({
      schools: [mockSchool],
      classes: mockClasses,
      fetchClasses: jest.fn(),
      deleteSchool: jest.fn(),
      deleteClass: jest.fn(),
      isLoading: false,
    });
  });

  it("renders school info and classes", () => {
    const { getByText } = render(<SchoolDetailsScreen />);
    expect(getByText("Test School")).toBeTruthy();
    expect(getByText("Class 1")).toBeTruthy();
  });

  it("navigates to new class screen", () => {
    const { getByText } = render(<SchoolDetailsScreen />);
    fireEvent.press(getByText("New Class"));
    expect(mockPush).toHaveBeenCalledWith("/school/1/class/new");
  });
});
