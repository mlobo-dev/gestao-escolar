import { useSchoolStore } from '../store/useSchoolStore';
import { useMemo } from 'react';

export const useSchools = (searchQuery: string = '') => {
  const schools = useSchoolStore((state) => state.schools);
  const isLoading = useSchoolStore((state) => state.isLoading);
  const addSchool = useSchoolStore((state) => state.addSchool);
  const updateSchool = useSchoolStore((state) => state.updateSchool);
  const deleteSchool = useSchoolStore((state) => state.deleteSchool);
  const fetchSchools = useSchoolStore((state) => state.fetchSchools);

  const filteredSchools = useMemo(() => {
    if (!searchQuery) return schools;
    return schools.filter((school) =>
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [schools, searchQuery]);

  return {
    schools: filteredSchools,
    allSchools: schools,
    isLoading,
    addSchool,
    updateSchool,
    deleteSchool,
    fetchSchools,
  };
};
