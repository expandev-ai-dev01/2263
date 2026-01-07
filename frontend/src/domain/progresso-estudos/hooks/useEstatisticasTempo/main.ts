/**
 * @hook useEstatisticasTempo
 * @description Hook for fetching time statistics
 */

import { useQuery } from '@tanstack/react-query';
import { progressoEstudosService } from '../../services/progressoEstudosService';
import type { EstatisticasTempoRequest } from '../../types';

export const useEstatisticasTempo = (
  usuarioId: number,
  periodoReferencia: 'diario' | 'semanal' | 'mensal'
) => {
  const request: EstatisticasTempoRequest = { usuarioId, periodoReferencia };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['estatisticas-tempo', usuarioId, periodoReferencia],
    queryFn: () => progressoEstudosService.getEstatisticasTempo(request),
    enabled: !!usuarioId,
  });

  return {
    estatisticas: data,
    isLoading,
    error,
    refetch,
  };
};
