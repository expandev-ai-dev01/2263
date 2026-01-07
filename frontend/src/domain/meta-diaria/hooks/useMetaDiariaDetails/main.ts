/**
 * @hook useMetaDiariaDetails
 * @description Hook for fetching meta diária details
 */

import { useQuery } from '@tanstack/react-query';
import { metaDiariaService } from '../../services/metaDiariaService';

export const useMetaDiariaDetails = (id: number | undefined) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['meta-diaria', id],
    queryFn: () => metaDiariaService.getById(id!),
    enabled: !!id,
  });

  return {
    meta: data,
    isLoading,
    error,
  };
};
