import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { ClassFormScreen } from "../screens/ClassFormScreen";
import { useClasses } from "../../../hooks/useClasses";

const mockAddClass = jest.fn();
const mockUpdateClass = jest.fn();

jest.mock("../../../hooks/useClasses", () => ({
  useClasses: jest.fn(() => ({
    allClasses: [
      { id: "c1", name: "Old Class", shift: "Morning", academicYear: "2024" },
    ],
    addClass: mockAddClass,
    updateClass: mockUpdateClass,
  })),
}));

jest.mock("../../../context/ThemeContext", () => ({
  useThemeContext: jest.fn(() => ({
    colorScheme: "light",
  })),
}));

const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
    canGoBack: () => true,
    replace: jest.fn(),
  }),
  useLocalSearchParams: jest.fn(() => ({ id: "1" })),
  Stack: {
    Screen: () => null,
  },
}));

describe("ClassFormScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders for new class and adds it", async () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(
      <ClassFormScreen />
    );

    fireEvent.changeText(
      getByPlaceholderText("class_name_placeholder"),
      "New Class"
    );
    fireEvent.changeText(getByPlaceholderText("year_placeholder"), "2025");

    fireEvent.press(getByTestId("save-class-button"));

    await waitFor(() => {
      expect(mockAddClass).toHaveBeenCalledWith(
        expect.objectContaining({
          schoolId: "1",
          name: "New Class",
          academicYear: "2025",
        })
      );
      expect(mockBack).toHaveBeenCalled();
    });
  });

  it("renders for editing class and updates it", async () => {
    // Change params to include classId
    const { useLocalSearchParams } = require("expo-router");
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      id: "1",
      classId: "c1",
    });

    const { getByDisplayValue, getByTestId } = render(<ClassFormScreen />);

    const nameInput = getByDisplayValue("Old Class");
    fireEvent.changeText(nameInput, "Updated Class");

    fireEvent.press(getByTestId("save-class-button"));

    await waitFor(() => {
      expect(mockUpdateClass).toHaveBeenCalledWith(
        "c1",
        expect.objectContaining({
          name: "Updated Class",
        })
      );
      expect(mockBack).toHaveBeenCalled();
    });
  });
});
