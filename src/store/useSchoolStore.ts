import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { School, SchoolClass } from "../types";

interface SchoolState {
  schools: School[];
  classes: SchoolClass[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  
  // Pagination metadata
  schoolPage: number;
  hasMoreSchools: boolean;
  totalSchools: number;
  classPage: number;
  hasMoreClasses: boolean;


  setSchools: (schools: School[]) => void;
  addSchool: (school: Omit<School, "id" | "countClasses">) => Promise<void>;
  updateSchool: (id: string, school: Partial<School>) => Promise<void>;
  deleteSchool: (id: string) => Promise<void>;

  setClasses: (classes: SchoolClass[]) => void;
  addClass: (schoolClass: Omit<SchoolClass, "id">) => Promise<void>;
  updateClass: (id: string, schoolClass: Partial<SchoolClass>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;

  fetchSchools: (refresh?: boolean) => Promise<void>;
  fetchClasses: (schoolId: string, refresh?: boolean) => Promise<void>;
}


export const useSchoolStore = create<SchoolState>()(
  persist(
    (set, get) => ({
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


      setSchools: (schools) => set({ schools }),

      fetchSchools: async (refresh = false) => {
        set({ isLoading: true });
        try {
          const response = await fetch("/api/schools");
          const data = await response.json();
          
          set({
            schools: data.schools,
            totalSchools: data.meta.total,
            isLoading: false,
            isLoadingMore: false,
            hasMoreSchools: false
          });
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
            totalSchools: state.totalSchools + 1,
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
            totalSchools: Math.max(0, state.totalSchools - 1),
          }));

        } catch (error) {
          set({ error: "Failed to delete school" });
        }
      },

      setClasses: (classes) => set({ classes }),

      fetchClasses: async (schoolId, refresh = false) => {
        const page = refresh ? 1 : get().classPage;
        if (page === 1) {
          set({ isLoading: true });
        } else {
          set({ isLoadingMore: true });
        }

        try {
          const response = await fetch(`/api/classes?schoolId=${schoolId}&page=${page}&limit=10`);
          const data = await response.json();
          
          set((state) => {
            const newClasses = refresh ? (data.classes || []) : [...state.classes, ...(data.classes || [])];
            // Remove duplicates by ID
            const uniqueClasses = Array.from(new Map(newClasses.map(c => [c.id, c])).values());

            return {
              classes: uniqueClasses,
              classPage: page + 1,
              hasMoreClasses: data.meta.hasMore,
              isLoading: false,
              isLoadingMore: false,
            };
          });


        } catch (error) {
          console.error("Fetch classes error:", error);
          set({ error: "Failed to fetch classes", isLoading: false, isLoadingMore: false });
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
