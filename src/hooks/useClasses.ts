import { useSchoolStore } from '../store/useSchoolStore';
import { useMemo } from 'react';

export const useClasses = (schoolId: string, searchQuery: string = '') => {
  const classes = useSchoolStore((state) => {
    // Robust comparison using String to handle ID type mismatches
    return state.classes.filter((c) => String(c.schoolId) === String(schoolId));
  });


  const isLoading = useSchoolStore((state) => state.isLoading);
  const isLoadingMore = useSchoolStore((state) => state.isLoadingMore);
  const hasMoreClasses = useSchoolStore((state) => state.hasMoreClasses);
  const addClass = useSchoolStore((state) => state.addClass);
  const updateClass = useSchoolStore((state) => state.updateClass);
  const deleteClass = useSchoolStore((state) => state.deleteClass);
  const fetchClasses = useSchoolStore((state) => state.fetchClasses);

  const filteredClasses = useMemo(() => {
    if (!searchQuery) return classes;
    return classes.filter((cls) =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [classes, searchQuery]);


  return {
    classes: filteredClasses,
    allClasses: classes,
    isLoading,
    isLoadingMore,
    hasMoreClasses,
    addClass,
    updateClass,
    deleteClass,
    fetchClasses,
  };
};
