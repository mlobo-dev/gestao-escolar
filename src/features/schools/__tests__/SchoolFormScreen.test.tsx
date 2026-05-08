import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { SchoolFormScreen, SchoolFormHeaderLeft } from "../screens/SchoolFormScreen";
import { useSchools } from "../../../hooks/useSchools";

const mockAddSchool = jest.fn();
const mockUpdateSchool = jest.fn();

jest.mock("../../../hooks/useSchools", () => ({
  useSchools: jest.fn(() => ({
    allSchools: [{ id: "1", name: "Old School", address: "Old Address" }],
    addSchool: mockAddSchool,
    updateSchool: mockUpdateSchool,
  })),
}));

jest.mock("../../../context/ThemeContext", () => ({
  useThemeContext: jest.fn(() => ({
    colorScheme: "light",
  })),
}));

const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockCanGoBack = jest.fn(() => true);

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
    canGoBack: mockCanGoBack,
    replace: mockReplace,
  }),
  useLocalSearchParams: jest.fn(() => ({ id: undefined })),
  Stack: {
    Screen: () => null,
  },
}));

// Mock lucide-react-native
jest.mock("lucide-react-native", () => ({
  ChevronLeft: () => null,
  Save: () => null,
}));

describe("SchoolFormScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls addSchool and navigates back on success", async () => {
    const { useLocalSearchParams } = require("expo-router");
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: undefined });

    const { getByTestId } = render(<SchoolFormScreen />);

    const nameInput = getByTestId("school-name-input");
    const addressInput = getByTestId("school-address-input");

    fireEvent.changeText(nameInput, "New Test School");
    fireEvent.changeText(addressInput, "Test Address 123");

    const saveButton = getByTestId("save-school-button");
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockAddSchool).toHaveBeenCalledWith({
        name: "New Test School",
        address: "Test Address 123",
      });
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("calls updateSchool and navigates back on success", async () => {
    const { useLocalSearchParams } = require("expo-router");
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: "1" });

    const { getByDisplayValue, getByTestId } = render(<SchoolFormScreen />);

    const nameInput = getByDisplayValue("Old School");
    fireEvent.changeText(nameInput, "Updated School");

    fireEvent.press(getByTestId("save-school-button"));

    await waitFor(() => {
      expect(mockUpdateSchool).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({
          name: "Updated School",
        })
      );
      expect(mockBack).toHaveBeenCalled();
    });
  });

  it("shows validation errors when fields are empty", () => {
    const { useLocalSearchParams } = require("expo-router");
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: undefined });

    const { getAllByText } = render(<SchoolFormScreen />);
    
    // Initial render with empty fields should show "Required field"
    expect(getAllByText(/required_field/i).length).toBe(2);
  });

  it("disables save button when fields are empty", () => {
    const { getByTestId } = render(<SchoolFormScreen />);
    const saveButton = getByTestId("save-school-button");
    
    expect(saveButton.props.accessibilityState.disabled).toBe(true);
  });

  it("returns null when editing a non-existent school", () => {
    const { useLocalSearchParams } = require("expo-router");
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: "non-existent" });

    const { toJSON } = render(<SchoolFormScreen />);
    expect(toJSON()).toBeNull();
  });

  describe("SchoolFormHeaderLeft", () => {
    it("uses router.back when canGoBack is true", () => {
       mockCanGoBack.mockReturnValue(true);
       const { getByTestId } = render(<SchoolFormHeaderLeft />);
       fireEvent.press(getByTestId("back-button"));
       expect(mockBack).toHaveBeenCalled();
    });

    it("uses router.replace when canGoBack is false", () => {
       mockCanGoBack.mockReturnValue(false);
       const { getByTestId } = render(<SchoolFormHeaderLeft />);
       fireEvent.press(getByTestId("back-button"));
       expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });
});
