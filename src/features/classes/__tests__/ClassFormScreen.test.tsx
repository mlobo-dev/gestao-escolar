import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { ClassFormScreen, ClassFormHeaderLeft } from "../screens/ClassFormScreen";
import { useClasses } from "../../../hooks/useClasses";

const mockAddClass = jest.fn();
const mockUpdateClass = jest.fn();

jest.mock("../../../hooks/useClasses", () => ({
  useClasses: jest.fn(),
}));

jest.mock("../../../context/ThemeContext", () => ({
  useThemeContext: jest.fn(() => ({
    colorScheme: "light",
  })),
}));

const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockCanGoBack = jest.fn(() => true);

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
    canGoBack: mockCanGoBack,
    replace: mockReplace,
    push: jest.fn(),
  }),
  useLocalSearchParams: jest.fn(),
  Stack: {
    Screen: () => null,
  },
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe("ClassFormScreen", () => {
  const mockClasses = [
    { id: "c1", name: "Old Class", shift: "Morning", academicYear: "2024" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useClasses as jest.Mock).mockReturnValue({
      allClasses: mockClasses,
      addClass: mockAddClass,
      updateClass: mockUpdateClass,
    });
    const { useLocalSearchParams } = require("expo-router");
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: "1" });
  });

  it("renders for new class and adds it", async () => {
    const { getByPlaceholderText, getByTestId } = render(<ClassFormScreen />);

    fireEvent.changeText(getByPlaceholderText("class_name_placeholder"), "New Class");
    fireEvent.changeText(getByPlaceholderText("year_placeholder"), "2025");

    fireEvent.press(getByTestId("save-class-button"));

    await waitFor(() => {
      expect(mockAddClass).toHaveBeenCalled();
      expect(mockBack).toHaveBeenCalled();
    });
  });

  it("renders for editing class and updates it", async () => {
    const { useLocalSearchParams } = require("expo-router");
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      id: "1",
      classId: "c1",
    });

    const { getByDisplayValue, getByTestId, getByText } = render(<ClassFormScreen />);

    expect(getByDisplayValue("Old Class")).toBeTruthy();
    
    // Change shift
    fireEvent.press(getByText("afternoon"));

    fireEvent.press(getByTestId("save-class-button"));

    await waitFor(() => {
      expect(mockUpdateClass).toHaveBeenCalledWith("c1", expect.objectContaining({
        shift: "Afternoon"
      }));
      expect(mockBack).toHaveBeenCalled();
    });
  });

  it("shows validation errors when fields are empty", () => {
    const { getAllByText, getByPlaceholderText } = render(<ClassFormScreen />);
    
    fireEvent.changeText(getByPlaceholderText("class_name_placeholder"), "");
    fireEvent.changeText(getByPlaceholderText("year_placeholder"), "");
    
    expect(getAllByText("required_field")).toHaveLength(2);
  });

  it("returns null when editing and class not found", () => {
    const { useLocalSearchParams } = require("expo-router");
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      id: "1",
      classId: "non-existent",
    });

    const { toJSON } = render(<ClassFormScreen />);
    expect(toJSON()).toBeNull();
  });

  describe("ClassFormHeaderLeft", () => {
    it("navigates back when back button is pressed", () => {
      const { getByTestId } = render(<ClassFormHeaderLeft />);
      fireEvent.press(getByTestId("back-button"));
      expect(mockBack).toHaveBeenCalled();
    });

    it("replaces with root if cannot go back", () => {
      mockCanGoBack.mockReturnValueOnce(false);
      const { getByTestId } = render(<ClassFormHeaderLeft />);
      fireEvent.press(getByTestId("back-button"));
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });
});
