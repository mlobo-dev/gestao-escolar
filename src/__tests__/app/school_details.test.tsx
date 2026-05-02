import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SchoolDetailsScreen from "../../../app/school/[id]/index";
import { useSchoolStore } from "../../store/useSchoolStore";

const mockStore = {
  schools: [{ id: "1", name: "Test School", address: "Test Address", countClasses: 1 }],
  classes: [{ id: "c1", name: "Class 1", shift: "Morning", academicYear: "2024", schoolId: "1" }],
  fetchClasses: jest.fn(),
  deleteSchool: jest.fn(),
  deleteClass: jest.fn(),
  isLoading: false,
  isLoadingMore: false,
  hasMoreClasses: false,
  classPage: 1,
};

jest.mock("../../store/useSchoolStore", () => ({
  useSchoolStore: jest.fn((selector) => (selector ? selector(mockStore) : mockStore)),
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
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it("renders school info and classes", () => {
    const { getByText } = render(<SchoolDetailsScreen />);
    expect(getByText("Test School")).toBeTruthy();
    expect(getByText("Class 1")).toBeTruthy();
  });

  it("navigates to new class screen", () => {
    const { getByTestId } = render(<SchoolDetailsScreen />);
    fireEvent.press(getByTestId("add-class-button"));
    expect(mockPush).toHaveBeenCalledWith("/school/1/class/new");
  });
});

