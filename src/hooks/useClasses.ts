import { useSchoolStore } from '../store/useSchoolStore';
import { useMemo } from 'react';

// Hook customizado para abstrair a lógica de filtragem e busca de turmas
export const useClasses = (schoolId: string, searchQuery: string = '') => {
  const classes = useSchoolStore((state) => {
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
    // Otimização: filtragem realizada via memoization para evitar re-renders desnecessários
    if (!searchQuery) return classes;
    return classes.filter((cls) =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.shift.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(cls.academicYear).includes(searchQuery)
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
