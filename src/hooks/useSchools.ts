import { useSchoolContext } from "../context/SchoolContext";
import { useMemo } from "react";

export const useSchools = (searchQuery: string = "") => {
  const {
    schools,
    isLoading,
    isLoadingMore,
    hasMoreSchools,
    addSchool,
    updateSchool,
    deleteSchool,
    fetchSchools,
    totalSchools,
  } = useSchoolContext();

  const filteredSchools = useMemo(() => {
    if (!searchQuery) return schools;
    return schools.filter(
      (school) =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [schools, searchQuery]);

  return {
    schools: filteredSchools,
    totalSchools,
    allSchools: schools,
    isLoading,
    isLoadingMore,
    hasMoreSchools,
    addSchool,
    updateSchool,
    deleteSchool,
    fetchSchools,
  };
};
