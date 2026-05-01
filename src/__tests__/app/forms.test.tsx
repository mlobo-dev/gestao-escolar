import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import EditSchoolScreen from "../../../app/school/[id]/edit";
import NewClassScreen from "../../../app/school/[id]/class/new";
import { useSchoolStore } from "../../store/useSchoolStore";

jest.mock("../../store/useSchoolStore", () => ({
  useSchoolStore: jest.fn(),
}));

const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
    canGoBack: () => true,
  }),
  useLocalSearchParams: () => ({ id: "1", classId: "c1" }),
  Stack: {
    Screen: () => null,
  },
}));

describe("Form Screens", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSchoolStore as unknown as jest.Mock).mockReturnValue({
      schools: [{ id: "1", name: "Old School", address: "Old Address" }],
      classes: [{ id: "c1", name: "Old Class", shift: "Morning", academicYear: "2024" }],
      updateSchool: jest.fn(),
      addClass: jest.fn(),
      updateClass: jest.fn(),
    });
  });

  it("renders EditSchoolScreen and updates info", async () => {
    const mockUpdateSchool = jest.fn();
    (useSchoolStore as unknown as jest.Mock).mockReturnValue({
      schools: [{ id: "1", name: "Old School", address: "Old Address" }],
      updateSchool: mockUpdateSchool,
    });

    const { getByDisplayValue, getByText } = render(<EditSchoolScreen />);
    
    const nameInput = getByDisplayValue("Old School");
    fireEvent.changeText(nameInput, "Updated School");
    
    fireEvent.press(getByText("Update School"));
    
    await waitFor(() => {
      expect(mockUpdateSchool).toHaveBeenCalledWith("1", expect.objectContaining({ name: "Updated School" }));
      expect(mockBack).toHaveBeenCalled();
    });
  });

  it("renders NewClassScreen and adds class", async () => {
    const mockAddClass = jest.fn();
    (useSchoolStore as unknown as jest.Mock).mockReturnValue({
      addClass: mockAddClass,
    });

    const { getByPlaceholderText, getByText } = render(<NewClassScreen />);
    
    fireEvent.changeText(getByPlaceholderText("e.g. 1st Year A"), "New Class");
    fireEvent.changeText(getByPlaceholderText("e.g. 2024"), "2025");
    
    fireEvent.press(getByText("Save Class"));
    
    await waitFor(() => {
      expect(mockAddClass).toHaveBeenCalledWith(expect.objectContaining({ schoolId: "1", name: "New Class", academicYear: "2025" }));
      expect(mockBack).toHaveBeenCalled();
    });
  });
});
