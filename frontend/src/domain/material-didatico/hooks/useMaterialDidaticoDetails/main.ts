/**
 * @hook useMaterialDidaticoDetails
 * @description Hook for fetching material didático details
 */

import { useQuery } from '@tanstack/react-query';
import { materialDidaticoService } from '../../services/materialDidaticoService';

export const useMaterialDidaticoDetails = (id: number | undefined) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['material-didatico', id],
    queryFn: () => materialDidaticoService.getById(id!),
    enabled: !!id,
  });

  return {
    material: data,
    isLoading,
    error,
  };
};
