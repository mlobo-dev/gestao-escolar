import { useSchoolContext } from "../context/SchoolContext";
import { useMemo } from "react";

// Hook customizado para abstrair a lógica de filtragem e busca de turmas
export const useClasses = (schoolId: string, searchQuery: string = "") => {
  const {
    classes: allStoreClasses,
    isLoading,
    isLoadingMore,
    hasMoreClasses,
    addClass,
    updateClass,
    deleteClass,
    fetchClasses,
  } = useSchoolContext();

  const schoolClasses = useMemo(() => {
    return allStoreClasses.filter(
      (c) => String(c.schoolId) === String(schoolId)
    );
  }, [allStoreClasses, schoolId]);

  const filteredClasses = useMemo(() => {
    // Otimização: filtragem realizada via memoization para evitar re-renders desnecessários
    if (!searchQuery) return schoolClasses;
    return schoolClasses.filter(
      (cls) =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.shift.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(cls.academicYear).includes(searchQuery)
    );
  }, [schoolClasses, searchQuery]);

  return {
    classes: filteredClasses,
    allClasses: schoolClasses,
    isLoading,
    isLoadingMore,
    hasMoreClasses,
    addClass,
    updateClass,
    deleteClass,
    fetchClasses,
  };
};
