import { useSchoolStore } from "../useSchoolStore";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock the API calls
global.fetch = jest.fn();

describe("useSchoolStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state manually if needed, but since it's a hook we just test its actions
  });

  it("should fetch schools and update state", async () => {
    const mockSchools = [
      { id: "1", name: "School 1", address: "Address 1", countClasses: 0 },
    ];
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        schools: mockSchools,
        meta: { total: 1, hasMore: false }
      }),
    });


    const store = useSchoolStore.getState();
    await store.fetchSchools();

    expect(useSchoolStore.getState().schools).toEqual(mockSchools);
    expect(useSchoolStore.getState().isLoading).toBe(false);
  });

  it("should add a new school", async () => {
    const newSchool = { name: "New School", address: "New Address" };
    const savedSchool = { id: "2", ...newSchool, countClasses: 0 };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ school: savedSchool }),
    });

    const store = useSchoolStore.getState();
    await store.addSchool(newSchool);

    const schools = useSchoolStore.getState().schools;
    expect(schools).toContainEqual(savedSchool);
  });

  it("should delete a school and its associated classes", async () => {
    // Setup state
    useSchoolStore.setState({
      schools: [{ id: "1", name: "School 1", address: "A1", countClasses: 1 }],
      classes: [{ id: "c1", schoolId: "1", name: "Class 1", shift: "Morning", academicYear: "2024" }],
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    const store = useSchoolStore.getState();
    await store.deleteSchool("1");

    expect(useSchoolStore.getState().schools).toHaveLength(0);
    expect(useSchoolStore.getState().classes).toHaveLength(0);
  });

  it("should delete a class and update school class count", async () => {
    // Setup state
    useSchoolStore.setState({
      schools: [{ id: "1", name: "School 1", address: "A1", countClasses: 1 }],
      classes: [{ id: "c1", schoolId: "1", name: "Class 1", shift: "Morning", academicYear: "2024" }],
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    const store = useSchoolStore.getState();
    await store.deleteClass("c1");

    expect(useSchoolStore.getState().classes).toHaveLength(0);
    expect(useSchoolStore.getState().schools[0].countClasses).toBe(0);
  });

  it("should only update the count of the correct school when deleting a class", async () => {
    // Setup state
    useSchoolStore.setState({
      schools: [
        { id: "1", name: "S1", address: "A1", countClasses: 1 },
        { id: "2", name: "S2", address: "A2", countClasses: 1 },
      ],
      classes: [
        { id: "c1", schoolId: "1", name: "C1", shift: "Morning", academicYear: "2024" },
        { id: "c2", schoolId: "2", name: "C2", shift: "Morning", academicYear: "2024" },
      ],
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    const store = useSchoolStore.getState();
    await store.deleteClass("c1");

    const state = useSchoolStore.getState();
    expect(state.classes).toHaveLength(1);
    expect(state.classes[0].id).toBe("c2");
    expect(state.schools.find((s) => s.id === "1")?.countClasses).toBe(0);
    expect(state.schools.find((s) => s.id === "2")?.countClasses).toBe(1);
  });
});
