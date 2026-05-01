import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { School, SchoolClass } from "../types";

interface SchoolState {
  schools: School[];
  classes: SchoolClass[];
  isLoading: boolean;
  error: string | null;

  setSchools: (schools: School[]) => void;
  addSchool: (school: Omit<School, "id" | "countClasses">) => Promise<void>;
  updateSchool: (id: string, school: Partial<School>) => Promise<void>;
  deleteSchool: (id: string) => Promise<void>;

  setClasses: (classes: SchoolClass[]) => void;
  addClass: (schoolClass: Omit<SchoolClass, "id">) => Promise<void>;
  updateClass: (id: string, schoolClass: Partial<SchoolClass>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;

  fetchSchools: () => Promise<void>;
  fetchClasses: (schoolId: string) => Promise<void>;
}

export const useSchoolStore = create<SchoolState>()(
  persist(
    (set, get) => ({
      schools: [],
      classes: [],
      isLoading: false,
      error: null,

      setSchools: (schools) => set({ schools }),

      fetchSchools: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch("/api/schools");
          const data = await response.json();
          // The API now returns countClasses directly
          set({ schools: data.schools, isLoading: false });
        } catch (error) {
          set({ error: "Failed to fetch schools", isLoading: false });
        }
      },

      addSchool: async (school) => {
        try {
          const response = await fetch("/api/schools", {
            method: "POST",
            body: JSON.stringify(school),
          });
          const newSchool = await response.json();
          set((state) => ({
            schools: [...state.schools, { ...newSchool.school, countClasses: 0 }],
          }));
        } catch (error) {
          set({ error: "Failed to add school" });
        }
      },

      updateSchool: async (id, school) => {
        try {
          await fetch(`/api/schools/${id}`, {
            method: "PATCH",
            body: JSON.stringify(school),
          });
          set((state) => ({
            schools: state.schools.map((s) => (s.id === id ? { ...s, ...school } : s)),
          }));
        } catch (error) {
          set({ error: "Failed to update school" });
        }
      },

      deleteSchool: async (id) => {
        try {
          await fetch(`/api/schools/${id}`, { method: "DELETE" });
          set((state) => ({
            schools: state.schools.filter((s) => s.id !== id),
            classes: state.classes.filter((c) => c.schoolId !== id),
          }));
        } catch (error) {
          set({ error: "Failed to delete school" });
        }
      },

      setClasses: (classes) => set({ classes }),

      fetchClasses: async (schoolId) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`/api/classes?schoolId=${schoolId}`);
          const data = await response.json();
          set({ classes: data.classes, isLoading: false });
        } catch (error) {
          set({ error: "Failed to fetch classes", isLoading: false });
        }
      },

      addClass: async (schoolClass) => {
        try {
          const response = await fetch("/api/classes", {
            method: "POST",
            body: JSON.stringify(schoolClass),
          });
          const newClass = await response.json();
          set((state) => ({
            classes: [...state.classes, newClass.class],
            schools: state.schools.map((s) =>
              s.id === schoolClass.schoolId
                ? { ...s, countClasses: s.countClasses + 1 }
                : s
            ),
          }));
        } catch (error) {
          set({ error: "Failed to add class" });
        }
      },

      updateClass: async (id, schoolClass) => {
        try {
          await fetch(`/api/classes/${id}`, {
            method: "PATCH",
            body: JSON.stringify(schoolClass),
          });
          set((state) => ({
            classes: state.classes.map((c) => (c.id === id ? { ...c, ...schoolClass } : c)),
          }));
        } catch (error) {
          set({ error: "Failed to update class" });
        }
      },

      deleteClass: async (id) => {
        try {
          const classToDelete = get().classes.find((c) => c.id === id);
          await fetch(`/api/classes/${id}`, { method: "DELETE" });
          set((state) => ({
            classes: state.classes.filter((c) => c.id !== id),
            schools: state.schools.map((s) =>
              s.id === classToDelete?.schoolId
                ? { ...s, countClasses: Math.max(0, s.countClasses - 1) }
                : s
            ),
          }));
        } catch (error) {
          set({ error: "Failed to delete class" });
        }
      },
    }),
    {
      name: "school-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
