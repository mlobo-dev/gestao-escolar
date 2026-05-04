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
    useSchoolStore.setState({
      schools: [],
      classes: [],
      isLoading: false,
      isLoadingMore: false,
      error: null,
      schoolPage: 1,
      hasMoreSchools: true,
      totalSchools: 0,
      classPage: 1,
      hasMoreClasses: true,
    });
  });

  describe("Schools", () => {
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

      await useSchoolStore.getState().fetchSchools();

      const state = useSchoolStore.getState();
      expect(state.schools).toEqual(mockSchools);
      expect(state.totalSchools).toBe(1);
      expect(state.isLoading).toBe(false);
    });

    it("should handle fetch schools error", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

      await useSchoolStore.getState().fetchSchools();

      const state = useSchoolStore.getState();
      expect(state.error).toBe("Failed to fetch schools");
      expect(state.isLoading).toBe(false);
    });

    it("should add a new school and update totals", async () => {
      const newSchoolData = { name: "New School", address: "New Address" };
      const savedSchool = { id: "2", ...newSchoolData, countClasses: 0 };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ school: savedSchool }),
      });

      await useSchoolStore.getState().addSchool(newSchoolData);

      const state = useSchoolStore.getState();
      expect(state.schools).toContainEqual(savedSchool);
      expect(state.totalSchools).toBe(1);
    });

    it("should handle add school error", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

      await useSchoolStore.getState().addSchool({ name: "Fail", address: "Fail" });

      expect(useSchoolStore.getState().error).toBe("Failed to add school");
    });

    it("should update an existing school", async () => {
      useSchoolStore.setState({
        schools: [{ id: "1", name: "Old Name", address: "A1", countClasses: 0 }],
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      await useSchoolStore.getState().updateSchool("1", { name: "New Name" });

      const school = useSchoolStore.getState().schools[0];
      expect(school.name).toBe("New Name");
    });

    it("should handle update school error", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Fail"));

      await useSchoolStore.getState().updateSchool("1", { name: "Fail" });

      expect(useSchoolStore.getState().error).toBe("Failed to update school");
    });

    it("should delete a school and its associated classes", async () => {
      useSchoolStore.setState({
        schools: [{ id: "1", name: "School 1", address: "A1", countClasses: 1 }],
        classes: [{ id: "c1", schoolId: "1", name: "Class 1", shift: "Morning", academicYear: "2024" }],
        totalSchools: 1
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      await useSchoolStore.getState().deleteSchool("1");

      const state = useSchoolStore.getState();
      expect(state.schools).toHaveLength(0);
      expect(state.classes).toHaveLength(0);
      expect(state.totalSchools).toBe(0);
    });
  });

  describe("Classes", () => {
    it("should fetch classes for a specific school", async () => {
      const mockClasses = [
        { id: "c1", name: "Class 1", shift: "Morning", academicYear: "2024", schoolId: "1" },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          classes: mockClasses,
          meta: { hasMore: false }
        }),
      });

      await useSchoolStore.getState().fetchClasses("1");

      const state = useSchoolStore.getState();
      expect(state.classes).toEqual(mockClasses);
      expect(state.isLoading).toBe(false);
    });

    it("should append classes when paginating", async () => {
      useSchoolStore.setState({
        classes: [{ id: "c1", schoolId: "1", name: "C1", shift: "M", academicYear: "24" }],
        classPage: 2
      });

      const nextClasses = [
        { id: "c2", schoolId: "1", name: "C2", shift: "M", academicYear: "24" },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          classes: nextClasses,
          meta: { hasMore: false }
        }),
      });

      await useSchoolStore.getState().fetchClasses("1");

      const state = useSchoolStore.getState();
      expect(state.classes).toHaveLength(2);
      expect(state.classPage).toBe(3);
    });

    it("should handle fetch classes error", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Fail"));

      await useSchoolStore.getState().fetchClasses("1");

      expect(useSchoolStore.getState().error).toBe("Failed to fetch classes");
    });

    it("should add a new class and update school class count", async () => {
      useSchoolStore.setState({
        schools: [{ id: "1", name: "S1", address: "A1", countClasses: 0 }],
      });

      const newClassData = { schoolId: "1", name: "C1", shift: "Morning", academicYear: "2024" } as any;
      const savedClass = { id: "c1", ...newClassData };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ class: savedClass }),
      });

      await useSchoolStore.getState().addClass(newClassData);

      const state = useSchoolStore.getState();
      expect(state.classes).toContainEqual(savedClass);
      expect(state.schools[0].countClasses).toBe(1);
    });

    it("should update a class", async () => {
      useSchoolStore.setState({
        classes: [{ id: "c1", schoolId: "1", name: "Old", shift: "M", academicYear: "24" }],
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      await useSchoolStore.getState().updateClass("c1", { name: "New" });

      expect(useSchoolStore.getState().classes[0].name).toBe("New");
    });

    it("should handle delete class error", async () => {
        useSchoolStore.setState({
          classes: [{ id: "c1", schoolId: "1", name: "C1", shift: "M", academicYear: "24" }],
        });
  
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Fail"));
  
        await useSchoolStore.getState().deleteClass("c1");
  
        expect(useSchoolStore.getState().error).toBe("Failed to delete class");
      });
  });
});
