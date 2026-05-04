import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import EditSchoolScreen from "../../../app/school/[id]/edit";
import NewClassScreen from "../../../app/school/[id]/class/new";
import { useSchoolStore } from "../../store/useSchoolStore";

let mockState = {
  schools: [{ id: "1", name: "Old School", address: "Old Address" }],
  classes: [{ id: "c1", name: "Old Class", shift: "Morning", academicYear: "2024" }],
  updateSchool: jest.fn(),
  addClass: jest.fn(),
  updateClass: jest.fn(),
  isLoading: false,
  isLoadingMore: false,
  hasMoreSchools: false,
  hasMoreClasses: false,
  schoolPage: 1,
  classPage: 1,
};

jest.mock("../../store/useSchoolStore", () => ({
  useSchoolStore: jest.fn((selector) => (selector ? selector(mockState) : mockState)),
}));


const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
    canGoBack: () => true,
    replace: jest.fn(),
  }),
  useLocalSearchParams: () => ({ id: "1", classId: "c1" }),
  Stack: {
    Screen: () => null,
  },
}));

describe("Form Screens", () => {
  jest.setTimeout(30000);
  beforeEach(() => {

    jest.clearAllMocks();
    mockState = {
      ...mockState,
      updateSchool: jest.fn(() => Promise.resolve()),
      addClass: jest.fn(() => Promise.resolve()),
      updateClass: jest.fn(() => Promise.resolve()),
    };
  });



  it("renders EditSchoolScreen and updates info", async () => {
    const mockUpdateSchool = jest.fn();
    mockState.updateSchool = mockUpdateSchool;

    const { getByDisplayValue, getByText } = render(<EditSchoolScreen />);
    
    const nameInput = getByDisplayValue("Old School");
    fireEvent.changeText(nameInput, "Updated School");
    
    fireEvent.press(getByText("update"));
    
    await waitFor(() => {
      expect(mockUpdateSchool).toHaveBeenCalledWith("1", expect.objectContaining({ name: "Updated School" }));
      expect(mockBack).toHaveBeenCalled();
    });
  });

  it("renders NewClassScreen and adds class", async () => {
    const mockAddClass = jest.fn();
    mockState.addClass = mockAddClass;

    const { getByPlaceholderText, getByText } = render(<NewClassScreen />);

    
    fireEvent.changeText(getByPlaceholderText("class_name_placeholder"), "New Class");
    fireEvent.changeText(getByPlaceholderText("year_placeholder"), "2025");
    
    fireEvent.press(getByText("save"));

    
    await waitFor(() => {
      expect(mockAddClass).toHaveBeenCalledWith(expect.objectContaining({ schoolId: "1", name: "New Class", academicYear: "2025" }));
      expect(mockBack).toHaveBeenCalled();
    });
  });
});

