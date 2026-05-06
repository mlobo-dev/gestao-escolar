import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import { SchoolProvider, useSchoolContext } from "../SchoolContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock the API calls
global.fetch = jest.fn();

describe("SchoolContext", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SchoolProvider>{children}</SchoolProvider>
  );

  describe("Schools", () => {
    it("should fetch schools and update state", async () => {
      const mockSchools = [
        { id: "1", name: "School 1", address: "Address 1", countClasses: 0 },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          schools: mockSchools,
          meta: { total: 1, hasMore: false },
        }),
      });

      const { result } = renderHook(() => useSchoolContext(), { wrapper });

      await act(async () => {
        await result.current.fetchSchools();
      });

      expect(result.current.schools).toEqual(mockSchools);
      expect(result.current.totalSchools).toBe(1);
    });

    it("should handle fetch schools error", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      const { result } = renderHook(() => useSchoolContext(), { wrapper });

      await act(async () => {
        await result.current.fetchSchools();
      });

      expect(result.current.error).toBe("Failed to fetch schools");
    });

    it("should add a new school and update totals", async () => {
      const newSchoolData = { name: "New School", address: "New Address" };
      const savedSchool = { id: "2", ...newSchoolData, countClasses: 0 };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ school: savedSchool }),
      });

      const { result } = renderHook(() => useSchoolContext(), { wrapper });

      await act(async () => {
        await result.current.addSchool(newSchoolData);
      });

      expect(result.current.schools).toContainEqual(savedSchool);
      expect(result.current.totalSchools).toBe(1);
    });

    it("should handle add school error", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Fail"));
      const { result } = renderHook(() => useSchoolContext(), { wrapper });

      await act(async () => {
        await result.current.addSchool({ name: "Fail", address: "Fail" });
      });

      expect(result.current.error).toBe("Failed to add school");
    });

    it("should update an existing school", async () => {
      const initialSchool = {
        id: "1",
        name: "Old Name",
        address: "A1",
        countClasses: 0,
      };

      // Setup state through addSchool mock to ensure it's in the state
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ school: initialSchool }),
      });

      const { result } = renderHook(() => useSchoolContext(), { wrapper });

      await act(async () => {
        await result.current.addSchool({ name: "Old Name", address: "A1" });
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      await act(async () => {
        await result.current.updateSchool("1", { name: "New Name" });
      });

      expect(result.current.schools[0].name).toBe("New Name");
    });

    it("should handle update school error", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Fail"));
      const { result } = renderHook(() => useSchoolContext(), { wrapper });

      await act(async () => {
        await result.current.updateSchool("1", { name: "Fail" });
      });

      expect(result.current.error).toBe("Failed to update school");
    });

    it("should delete a school and its associated classes", async () => {
      const school = { id: "1", name: "S1", address: "A1", countClasses: 0 };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ school }),
      });

      const { result } = renderHook(() => useSchoolContext(), { wrapper });

      await act(async () => {
        await result.current.addSchool(school);
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      await act(async () => {
        await result.current.deleteSchool("1");
      });

      expect(result.current.schools).toHaveLength(0);
      expect(result.current.totalSchools).toBe(0);
    });
  });

  describe("Classes", () => {
    it("should fetch classes for a specific school", async () => {
      const mockClasses = [
        {
          id: "c1",
          name: "Class 1",
          shift: "Morning",
          academicYear: "2024",
          schoolId: "1",
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          classes: mockClasses,
          meta: { hasMore: false },
        }),
      });

      const { result } = renderHook(() => useSchoolContext(), { wrapper });

      await act(async () => {
        await result.current.fetchClasses("1");
      });

      expect(result.current.classes).toEqual(mockClasses);
    });

    it("should append classes when paginating", async () => {
      const { result } = renderHook(() => useSchoolContext(), { wrapper });

      // First page
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          classes: [{ id: "c1", name: "C1", schoolId: "1" }],
          meta: { hasMore: true },
        }),
      });

      await act(async () => {
        await result.current.fetchClasses("1");
      });

      // Second page
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          classes: [{ id: "c2", name: "C2", schoolId: "1" }],
          meta: { hasMore: false },
        }),
      });

      await act(async () => {
        await result.current.fetchClasses("1");
      });

      expect(result.current.classes).toHaveLength(2);
    });

    it("should handle fetch classes error", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Fail"));
      const { result } = renderHook(() => useSchoolContext(), { wrapper });

      await act(async () => {
        await result.current.fetchClasses("1");
      });

      expect(result.current.error).toBe("Failed to fetch classes");
    });

    it("should add a new class and update school class count", async () => {
      const school = { id: "1", name: "S1", address: "A1", countClasses: 0 };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ school }),
      });

      const { result } = renderHook(() => useSchoolContext(), { wrapper });

      await act(async () => {
        await result.current.addSchool(school);
      });

      const newClassData = {
        schoolId: "1",
        name: "C1",
        shift: "Morning",
        academicYear: "2024",
      } as any;
      const savedClass = { id: "c1", ...newClassData };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ class: savedClass }),
      });

      await act(async () => {
        await result.current.addClass(newClassData);
      });

      expect(result.current.classes).toContainEqual(savedClass);
      expect(result.current.schools[0].countClasses).toBe(1);
    });

    it("should update a class", async () => {
      const initialClass = {
        id: "c1",
        schoolId: "1",
        name: "Old",
        shift: "Morning",
        academicYear: "2024",
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          classes: [initialClass],
          meta: { hasMore: false },
        }),
      });

      const { result } = renderHook(() => useSchoolContext(), { wrapper });

      await act(async () => {
        await result.current.fetchClasses("1");
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      await act(async () => {
        await result.current.updateClass("c1", { name: "New" });
      });

      expect(result.current.classes[0].name).toBe("New");
    });

    it("should handle delete class error", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Fail"));
      const { result } = renderHook(() => useSchoolContext(), { wrapper });

      await act(async () => {
        await result.current.deleteClass("c1");
      });

      expect(result.current.error).toBe("Failed to delete class");
    });
  });
});
