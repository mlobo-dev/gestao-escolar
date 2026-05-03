import { useSchoolStore } from '../store/useSchoolStore';
import { useMemo } from 'react';

export const useSchools = (searchQuery: string = '') => {
  const schools = useSchoolStore((state) => state.schools);
  const isLoading = useSchoolStore((state) => state.isLoading);
  const isLoadingMore = useSchoolStore((state) => state.isLoadingMore);
  const hasMoreSchools = useSchoolStore((state) => state.hasMoreSchools);
  const addSchool = useSchoolStore((state) => state.addSchool);
  const updateSchool = useSchoolStore((state) => state.updateSchool);
  const deleteSchool = useSchoolStore((state) => state.deleteSchool);
  const fetchSchools = useSchoolStore((state) => state.fetchSchools);
  const totalSchools = useSchoolStore((state) => state.totalSchools);


  const classes = useSchoolStore((state) => state.classes);

  const filteredSchools = useMemo(() => {
    const schoolsWithCount = schools.map(school => ({
      ...school,
      countClasses: (classes || []).filter(c => String(c.schoolId) === String(school.id)).length
    }));


    if (!searchQuery) return schoolsWithCount;
    return schoolsWithCount.filter((school) =>
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [schools, searchQuery, classes]);


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
