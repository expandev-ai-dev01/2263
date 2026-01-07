/**
 * @hook useHistoricoSessoes
 * @description Hook for fetching session history
 */

import { useQuery } from '@tanstack/react-query';
import { tempoEstudoService } from '../../services/tempoEstudoService';
import type { ObterHistoricoParams } from '../../types';

export const useHistoricoSessoes = (params: ObterHistoricoParams) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tempo-estudo-historico', params],
    queryFn: () => tempoEstudoService.obterHistorico(params),
    enabled: !!params.usuarioId,
  });

  return {
    historico: data ?? [],
    isLoading,
    error,
    refetch,
  };
};
