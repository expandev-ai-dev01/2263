/**
 * @hook useComparacaoPeriodos
 * @description Hook for fetching period comparison data
 */

import { useQuery } from '@tanstack/react-query';
import { progressoEstudosService } from '../../services/progressoEstudosService';
import type { ComparacaoPeriodosRequest, FiltrosProgresso } from '../../types';

interface UseComparacaoPeriodosOptions {
  usuarioId: number;
  periodoAtual: 'esta_semana' | 'este_mes' | 'este_trimestre';
  periodoComparacao: 'semana_anterior' | 'mes_anterior' | 'trimestre_anterior';
  metricaComparacao: 'tempo_estudo' | 'conteudos_concluidos' | 'desempenho_questoes';
  filtros?: FiltrosProgresso;
}

export const useComparacaoPeriodos = (options: UseComparacaoPeriodosOptions) => {
  const request: ComparacaoPeriodosRequest = {
    usuarioId: options.usuarioId,
    periodoAtual: options.periodoAtual,
    periodoComparacao: options.periodoComparacao,
    metricaComparacao: options.metricaComparacao,
    filtros: options.filtros,
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['comparacao-periodos', options],
    queryFn: () => progressoEstudosService.getComparacaoPeriodos(request),
    enabled: !!options.usuarioId,
  });

  return {
    comparacao: data,
    isLoading,
    error,
    refetch,
  };
};
