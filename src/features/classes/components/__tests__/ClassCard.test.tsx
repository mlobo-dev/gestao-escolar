import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ClassCard } from "../ClassCard";
import { ThemeProvider } from "../../../../context/ThemeContext";

const mockClass = {
  id: "1",
  name: "Class A",
  shift: "Morning" as const,
  schoolId: "school-1",
  academicYear: "2024",
};

describe("ClassCard component", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  it("renders class details correctly", () => {
    const { getByText } = render(
      <ThemeProvider>
        <ClassCard 
          item={mockClass} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      </ThemeProvider>
    );
    expect(getByText("Class A")).toBeTruthy();
    expect(getByText("morning")).toBeTruthy();
  });

  it("calls onEdit when edit button is pressed", () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <ClassCard 
          item={mockClass} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      </ThemeProvider>
    );
    fireEvent.press(getByTestId("edit-class-button"));
    expect(mockOnEdit).toHaveBeenCalledWith("1");
  });

  it("calls onDelete when delete button is pressed", () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <ClassCard 
          item={mockClass} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      </ThemeProvider>
    );
    fireEvent.press(getByTestId("delete-class-button"));
    expect(mockOnDelete).toHaveBeenCalledWith("1", "Class A");
  });

  it("renders correctly in dark mode", () => {
    const { getByText } = render(
      <ThemeProvider initialValue="dark">
        <ClassCard 
          item={mockClass} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      </ThemeProvider>
    );
    expect(getByText("Class A")).toBeTruthy();
  });
});
