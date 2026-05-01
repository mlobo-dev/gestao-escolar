import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import NewSchoolScreen from "../../../app/school/new";
import { useSchoolStore } from "../../store/useSchoolStore";

// Mock the store
jest.mock("../../store/useSchoolStore", () => ({
  useSchoolStore: jest.fn(),
}));

const mockAddSchool = jest.fn();
const mockBack = jest.fn();

// Mock useRouter from the setup but allow local overrides if needed
jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
    canGoBack: () => true,
    replace: jest.fn(),
  }),
  Stack: {
    Screen: ({ options }) => {
      // Execute the headerLeft if it exists to test it
      if (options && options.headerLeft) {
        options.headerLeft();
      }
      return null;
    },
  },
}));

describe("NewSchoolScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSchoolStore as unknown as jest.Mock).mockReturnValue({
      addSchool: mockAddSchool,
    });
  });

  it("renders correctly and validates inputs", async () => {
    const { getByPlaceholderText, getByText } = render(<NewSchoolScreen />);

    const saveButton = getByText("Save School");
    fireEvent.press(saveButton);

    // Should show validation messages
    expect(getByText("School name is required")).toBeTruthy();
    expect(getByText("Address is required")).toBeTruthy();
  });

  it("calls addSchool and navigates back on success", async () => {
    const { getByPlaceholderText, getByText } = render(<NewSchoolScreen />);

    const nameInput = getByPlaceholderText("e.g. Central High School");
    const addressInput = getByPlaceholderText("e.g. 123 Education St, City");

    fireEvent.changeText(nameInput, "New Test School");
    fireEvent.changeText(addressInput, "Test Address 123");

    const saveButton = getByText("Save School");
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockAddSchool).toHaveBeenCalledWith({
        name: "New Test School",
        address: "Test Address 123",
      });
      expect(mockBack).toHaveBeenCalled();
    });
  });
});
