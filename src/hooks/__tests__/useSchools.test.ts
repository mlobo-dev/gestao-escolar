import { renderHook } from "@testing-library/react-native";
import { useSchools } from "../useSchools";
import { useSchoolContext } from "../../context/SchoolContext";

jest.mock("../../context/SchoolContext", () => ({
  useSchoolContext: jest.fn(),
}));

describe("useSchools hook", () => {
  const mockSchools = [
    { id: "1", name: "School A", address: "Street 1" },
    { id: "2", name: "School B", address: "Street 2" },
  ];

  beforeEach(() => {
    (useSchoolContext as jest.Mock).mockReturnValue({
      schools: mockSchools,
      isLoading: false,
      isLoadingMore: false,
      hasMoreSchools: true,
      totalSchools: 2,
      addSchool: jest.fn(),
      updateSchool: jest.fn(),
      deleteSchool: jest.fn(),
      fetchSchools: jest.fn(),
    });
  });

  it("should return all schools when no search query is provided", () => {
    const { result } = renderHook(() => useSchools());
    expect(result.current.schools).toHaveLength(2);
    expect(result.current.schools).toEqual(mockSchools);
  });

  it("should filter schools by name", () => {
    const { result } = renderHook(() => useSchools("School A"));
    expect(result.current.schools).toHaveLength(1);
    expect(result.current.schools[0].name).toBe("School A");
  });

  it("should filter schools by address", () => {
    const { result } = renderHook(() => useSchools("Street 2"));
    expect(result.current.schools).toHaveLength(1);
    expect(result.current.schools[0].name).toBe("School B");
  });

  it("should return empty array when no matches are found", () => {
    const { result } = renderHook(() => useSchools("Non-existent"));
    expect(result.current.schools).toHaveLength(0);
  });
});
