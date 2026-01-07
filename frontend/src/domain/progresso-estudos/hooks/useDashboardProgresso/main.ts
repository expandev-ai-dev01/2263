/**
 * @hook useDashboardProgresso
 * @description Hook for fetching dashboard progress data
 */

import { useQuery } from '@tanstack/react-query';
import { progressoEstudosService } from '../../services/progressoEstudosService';
import type { DashboardProgressoRequest } from '../../types';

export const useDashboardProgresso = (usuarioId: number) => {
  const request: DashboardProgressoRequest = { usuarioId };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-progresso', usuarioId],
    queryFn: () => progressoEstudosService.getDashboard(request),
    enabled: !!usuarioId,
  });

  return {
    dashboard: data,
    isLoading,
    error,
    refetch,
  };
};
