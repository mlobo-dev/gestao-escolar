import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import NewSchoolScreen from "../../../app/school/new";
import { useSchoolStore } from "../../store/useSchoolStore";

// Mock the store
const mockStore = {
  addSchool: jest.fn(),
};

jest.mock("../../store/useSchoolStore", () => ({
  useSchoolStore: jest.fn((selector) => (selector ? selector(mockStore) : mockStore)),
}));


const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
    canGoBack: () => true,
    replace: mockReplace,
  }),
  Stack: {
    Screen: () => null,
  },
}));

describe("NewSchoolScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls addSchool and navigates back on success", async () => {
    const { getByTestId } = render(<NewSchoolScreen />);

    const nameInput = getByTestId("school-name-input");
    const addressInput = getByTestId("school-address-input");

    fireEvent.changeText(nameInput, "New Test School");
    fireEvent.changeText(addressInput, "Test Address 123");

    const saveButton = getByTestId("save-school-button");
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockStore.addSchool).toHaveBeenCalledWith({
        name: "New Test School",
        address: "Test Address 123",
      });
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  }, 10000);
});

