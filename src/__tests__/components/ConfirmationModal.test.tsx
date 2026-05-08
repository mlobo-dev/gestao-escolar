import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { useThemeContext } from "../../context/ThemeContext";

jest.mock("../../context/ThemeContext", () => ({
  useThemeContext: jest.fn(() => ({
    colorScheme: "light",
  })),
}));

describe("ConfirmationModal", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  it("renders correctly and handles actions", () => {
    const { getByText } = render(
      <ConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Title"
        message="Test Message"
      />
    );

    expect(getByText("Test Title")).toBeTruthy();
    expect(getByText("Test Message")).toBeTruthy();

    fireEvent.press(getByText("delete"));
    expect(mockOnConfirm).toHaveBeenCalled();

    fireEvent.press(getByText("cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("does not render when closed", () => {
    const { queryByText } = render(
      <ConfirmationModal
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Title"
        message="Test Message"
      />
    );

    expect(queryByText("Test Title")).toBeNull();
  });
});
