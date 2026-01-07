/**
 * @hook useDisciplinaDetails
 * @description Hook for fetching disciplina details
 */

import { useQuery } from '@tanstack/react-query';
import { disciplinaService } from '../../services/disciplinaService';

export const useDisciplinaDetails = (id: string | undefined) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['disciplina', id],
    queryFn: () => disciplinaService.getById(id!),
    enabled: !!id,
  });

  return {
    disciplina: data,
    isLoading,
    error,
  };
};
