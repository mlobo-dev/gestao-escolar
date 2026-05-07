import React from "react";
import { render } from "@testing-library/react-native";
import { ClassCard } from "../ClassCard";
import { ThemeProvider } from "../../../../context/ThemeContext";

const mockClass = {
  id: "1",
  name: "Class A",
  shift: "Morning",
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
