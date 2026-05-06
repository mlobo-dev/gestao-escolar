import { renderHook } from "@testing-library/react-native";
import { useClasses } from "../useClasses";
import { useSchoolContext } from "../../context/SchoolContext";

jest.mock("../../context/SchoolContext", () => ({
  useSchoolContext: jest.fn(),
}));

describe("useClasses hook", () => {
  const mockClasses = [
    {
      id: "1",
      schoolId: "101",
      name: "Class 1",
      shift: "Morning",
      academicYear: "2024",
    },
    {
      id: "2",
      schoolId: "101",
      name: "Class 2",
      shift: "Afternoon",
      academicYear: "2024",
    },
    {
      id: "3",
      schoolId: "102",
      name: "Class 3",
      shift: "Night",
      academicYear: "2024",
    },
  ];

  beforeEach(() => {
    (useSchoolContext as jest.Mock).mockReturnValue({
      classes: mockClasses,
      isLoading: false,
      isLoadingMore: false,
      hasMoreClasses: true,
      addClass: jest.fn(),
      updateClass: jest.fn(),
      deleteClass: jest.fn(),
      fetchClasses: jest.fn(),
    });
  });

  it("should return classes only for the specified schoolId", () => {
    const { result } = renderHook(() => useClasses("101"));
    expect(result.current.classes).toHaveLength(2);
    expect(result.current.classes.every((c) => c.schoolId === "101")).toBe(
      true
    );
  });

  it("should filter classes by name", () => {
    const { result } = renderHook(() => useClasses("101", "Class 1"));
    expect(result.current.classes).toHaveLength(1);
    expect(result.current.classes[0].name).toBe("Class 1");
  });

  it("should filter classes by shift", () => {
    const { result } = renderHook(() => useClasses("101", "Afternoon"));
    expect(result.current.classes).toHaveLength(1);
    expect(result.current.classes[0].shift).toBe("Afternoon");
  });

  it("should filter classes by academicYear", () => {
    const { result } = renderHook(() => useClasses("101", "2024"));
    expect(result.current.classes).toHaveLength(2);
  });

  it("should return empty array when no matches are found", () => {
    const { result } = renderHook(() => useClasses("101", "Non-existent"));
    expect(result.current.classes).toHaveLength(0);
  });
});
