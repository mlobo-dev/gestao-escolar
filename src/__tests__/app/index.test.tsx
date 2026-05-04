import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HomeScreen from "../../../app/index";
import { useSchoolStore } from "../../store/useSchoolStore";

const mockStore = {
  schools: [
    { id: "1", name: "School 1", address: "Address 1", countClasses: 3 },
    { id: "2", name: "School 2", address: "Address 2", countClasses: 5 },
  ],
  classes: [],
  fetchSchools: jest.fn(),
  totalSchools: 2,
  isLoading: false,
  isLoadingMore: false,
  hasMoreSchools: false,
  schoolPage: 1,
};



jest.mock("../../store/useSchoolStore", () => ({
  useSchoolStore: jest.fn((selector) => (selector ? selector(mockStore) : mockStore)),
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

describe("HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it("renders the list of schools and their class counts", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText("School 1")).toBeTruthy();
    expect(getByText(/3 classes/i)).toBeTruthy();
    expect(getByText("School 2")).toBeTruthy();
    expect(getByText(/5 classes/i)).toBeTruthy();
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
