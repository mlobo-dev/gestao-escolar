import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { School, SchoolClass } from "../types";
import { schoolService } from "../services/schoolService";
import { classService } from "../services/classService";
import { STORAGE_KEYS, PAGINATION } from "../constants";

interface SchoolContextType {
  schools: School[];
  classes: SchoolClass[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  schoolPage: number;
  hasMoreSchools: boolean;
  totalSchools: number;
  classPage: number;
  hasMoreClasses: boolean;

  addSchool: (school: Omit<School, "id" | "countClasses">) => Promise<void>;
  updateSchool: (id: string, school: Partial<School>) => Promise<void>;
  deleteSchool: (id: string) => Promise<void>;
  addClass: (schoolClass: Omit<SchoolClass, "id">) => Promise<void>;
  updateClass: (id: string, schoolClass: Partial<SchoolClass>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  fetchSchools: (refresh?: boolean) => Promise<void>;
  fetchClasses: (schoolId: string, refresh?: boolean) => Promise<void>;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schoolPage, setSchoolPage] = useState(1);
  const [hasMoreSchools, setHasMoreSchools] = useState(true);
  const [totalSchools, setTotalSchools] = useState(0);
  const [classPage, setClassPage] = useState(1);
  const [hasMoreClasses, setHasMoreClasses] = useState(true);

  // Persistence: Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEYS.SCHOOL_DATA);
        if (savedData) {
          const { state } = JSON.parse(savedData);
          setSchools(state.schools || []);
          setClasses(state.classes || []);
          setTotalSchools(state.totalSchools || 0);
          setSchoolPage(state.schoolPage || 1);
        }
      } catch (e) {
        console.error("Failed to load school data", e);
      }
    };
    loadData();
  }, []);

  // Persistence: Save data when state changes
  useEffect(() => {
    const saveData = async () => {
      try {
        const dataToSave = {
          state: { schools, classes, totalSchools, schoolPage },
        };
        await AsyncStorage.setItem(
          STORAGE_KEYS.SCHOOL_DATA,
          JSON.stringify(dataToSave)
        );
      } catch (e) {
        console.error("Failed to save school data", e);
      }
    };
    saveData();
  }, [schools, classes, totalSchools, schoolPage]);

  const fetchSchools = useCallback(
    async (refresh = false) => {
      if (schools.length > 0 && !refresh && schoolPage === 1) return;

      setIsLoading(true);
      try {
        const data = await schoolService.getSchools(1, 100); // For simplicity, fetch all or a large first page
        setSchools(data.schools);
        setTotalSchools(data.meta.total);
        setHasMoreSchools(false);
      } catch (err) {
        setError("Failed to fetch schools");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [schools.length, schoolPage]
  );

  const addSchool = useCallback(
    async (school: Omit<School, "id" | "countClasses">) => {
      try {
        const data = await schoolService.createSchool(school);
        setSchools((prev) => [...prev, { ...data.school, countClasses: 0 }]);
        setTotalSchools((prev) => prev + 1);
      } catch (err) {
        setError("Failed to add school");
      }
    },
    []
  );

  const updateSchool = useCallback(
    async (id: string, school: Partial<School>) => {
      try {
        await schoolService.updateSchool(id, school);
        setSchools((prev) =>
          prev.map((s) => (s.id === id ? { ...s, ...school } : s))
        );
      } catch (err) {
        setError("Failed to update school");
      }
    },
    []
  );

  const deleteSchool = useCallback(async (id: string) => {
    try {
      await schoolService.deleteSchool(id);
      setSchools((prev) => prev.filter((s) => s.id !== id));
      setClasses((prev) => prev.filter((c) => c.schoolId !== id));
      setTotalSchools((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setError("Failed to delete school");
    }
  }, []);

  const fetchClasses = useCallback(
    async (schoolId: string, refresh = false) => {
      const page = refresh ? 1 : classPage;
      const hasLocalClasses = classes.some(
        (c) => String(c.schoolId) === String(schoolId)
      );

      if (hasLocalClasses && !refresh && page === 1) return;

      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const data = await classService.getClasses(
          schoolId,
          page,
          PAGINATION.DEFAULT_PAGE_SIZE
        );
        const mappedClasses = (data.classes || []).map((c: any) => ({
          ...c,
          schoolId: c.schoolId || schoolId,
        }));

        setClasses((prev) => {
          const otherSchoolsClasses = refresh
            ? prev.filter((c: any) => String(c.schoolId) !== String(schoolId))
            : prev;

          const combined = [...otherSchoolsClasses, ...mappedClasses];
          return Array.from(
            new Map(combined.map((c: any) => [c.id, c])).values()
          );
        });

        setClassPage(page + 1);
        setHasMoreClasses(data.meta.hasMore);
      } catch (err) {
        console.error("Fetch classes error:", err);
        setError("Failed to fetch classes");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [classPage, classes]
  );

  const addClass = useCallback(async (schoolClass: Omit<SchoolClass, "id">) => {
    try {
      const data = await classService.createClass(schoolClass);
      setClasses((prev) => [...prev, data.class]);
      setSchools((prev) =>
        prev.map((s) =>
          s.id === schoolClass.schoolId
            ? { ...s, countClasses: s.countClasses + 1 }
            : s
        )
      );
    } catch (err) {
      setError("Failed to add class");
    }
  }, []);

  const updateClass = useCallback(
    async (id: string, schoolClass: Partial<SchoolClass>) => {
      try {
        await classService.updateClass(id, schoolClass);
        setClasses((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...schoolClass } : c))
        );
      } catch (err) {
        setError("Failed to update class");
      }
    },
    []
  );

  const deleteClass = useCallback(
    async (id: string) => {
      try {
        const classToDelete = classes.find((c) => c.id === id);
        await classService.deleteClass(id);
        setClasses((prev) => prev.filter((c) => c.id !== id));
        setSchools((prev) =>
          prev.map((s) =>
            s.id === classToDelete?.schoolId
              ? { ...s, countClasses: Math.max(0, s.countClasses - 1) }
              : s
          )
        );
      } catch (err) {
        setError("Failed to delete class");
      }
    },
    [classes]
  );

  const contextValue = useMemo(
    () => ({
      schools,
      classes,
      isLoading,
      isLoadingMore,
      error,
      schoolPage,
      hasMoreSchools,
      totalSchools,
      classPage,
      hasMoreClasses,
      addSchool,
      updateSchool,
      deleteSchool,
      addClass,
      updateClass,
      deleteClass,
      fetchSchools,
      fetchClasses,
    }),
    [
      schools,
      classes,
      isLoading,
      isLoadingMore,
      error,
      schoolPage,
      hasMoreSchools,
      totalSchools,
      classPage,
      hasMoreClasses,
      addSchool,
      updateSchool,
      deleteSchool,
      addClass,
      updateClass,
      deleteClass,
      fetchSchools,
      fetchClasses,
    ]
  );

  return (
    <SchoolContext.Provider value={contextValue}>
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchoolContext = () => {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error("useSchoolContext must be used within a SchoolProvider");
  }
  return context;
};
