/**
 * @hook useGraficoEvolucao
 * @description Hook for fetching evolution chart data
 */

import { useQuery } from '@tanstack/react-query';
import { progressoEstudosService } from '../../services/progressoEstudosService';
import type { GraficoEvolucaoRequest, FiltrosProgresso } from '../../types';

interface UseGraficoEvolucaoOptions {
  usuarioId: number;
  tipoGrafico: 'linha' | 'barra' | 'area';
  periodoGrafico: '7dias' | '30dias' | '90dias' | '1ano';
  metricaExibida:
    | 'tempo_estudo'
    | 'conteudos_concluidos'
    | 'desempenho_questoes'
    | 'percentual_acertos'
    | 'questoes_resolvidas';
  filtros?: FiltrosProgresso;
}

export const useGraficoEvolucao = (options: UseGraficoEvolucaoOptions) => {
  const request: GraficoEvolucaoRequest = {
    usuarioId: options.usuarioId,
    tipoGrafico: options.tipoGrafico,
    periodoGrafico: options.periodoGrafico,
    metricaExibida: options.metricaExibida,
    filtros: options.filtros,
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['grafico-evolucao', options],
    queryFn: () => progressoEstudosService.getGraficoEvolucao(request),
    enabled: !!options.usuarioId,
  });

  return {
    grafico: data,
    isLoading,
    error,
    refetch,
  };
};
