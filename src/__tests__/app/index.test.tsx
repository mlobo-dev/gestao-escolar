import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HomeScreen from "../../../app/index";
import { useSchoolStore } from "../../store/useSchoolStore";

jest.mock("../../store/useSchoolStore", () => ({
  useSchoolStore: jest.fn(),
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

describe("HomeScreen", () => {
  const mockSchools = [
    { id: "1", name: "School 1", address: "Address 1" },
    { id: "2", name: "School 2", address: "Address 2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useSchoolStore as unknown as jest.Mock).mockReturnValue({
      schools: mockSchools,
      fetchSchools: jest.fn(),
      isLoading: false,
    });
  });

  it("renders the list of schools", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText("School 1")).toBeTruthy();
    expect(getByText("School 2")).toBeTruthy();
  });

  it("navigates to school details on press", () => {
    const { getByText } = render(<HomeScreen />);
    fireEvent.press(getByText("School 1"));
    expect(mockPush).toHaveBeenCalledWith("/school/1");
  });

  it("navigates to new school screen", () => {
    const { getByTestId } = render(<HomeScreen />);
    fireEvent.press(getByTestId("add-school-button"));
    expect(mockPush).toHaveBeenCalledWith("/school/new");
  });
});
