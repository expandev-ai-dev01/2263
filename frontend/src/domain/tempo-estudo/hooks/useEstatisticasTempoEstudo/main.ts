/**
 * @hook useEstatisticasTempoEstudo
 * @description Hook for fetching time statistics
 */

import { useQuery } from '@tanstack/react-query';
import { tempoEstudoService } from '../../services/tempoEstudoService';
import type { ObterEstatisticasParams } from '../../types';

export const useEstatisticasTempoEstudo = (params: ObterEstatisticasParams) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tempo-estudo-estatisticas', params],
    queryFn: () => tempoEstudoService.obterEstatisticas(params),
    enabled: !!params.usuarioId && !!params.dataInicio && !!params.dataFim,
  });

  return {
    estatisticas: data,
    isLoading,
    error,
    refetch,
  };
};
