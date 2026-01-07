/**
 * @service ProgressoEstudosService
 * @domain progresso-estudos
 * @type REST API Service
 * @description Service for managing Progresso de Estudos operations
 */

import { authenticatedClient } from '@/core/lib/api';
import type {
  DashboardProgresso,
  EstatisticasTempo,
  GraficoEvolucao,
  RelatorioProgresso,
  PreferenciasNotificacao,
  ComparacaoPeriodos,
  DashboardProgressoRequest,
  EstatisticasTempoRequest,
  GraficoEvolucaoRequest,
  RelatorioProgressoRequest,
  PreferenciasNotificacaoRequest,
  ComparacaoPeriodosRequest,
} from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const progressoEstudosService = {
  /**
   * Get dashboard progress data
   */
  async getDashboard(request: DashboardProgressoRequest): Promise<DashboardProgresso> {
    const { data } = await authenticatedClient.post<ApiResponse<DashboardProgresso>>(
      '/progresso-estudos/dashboard',
      request
    );
    return data.data;
  },

  /**
   * Get time statistics
   */
  async getEstatisticasTempo(request: EstatisticasTempoRequest): Promise<EstatisticasTempo> {
    const { data } = await authenticatedClient.post<ApiResponse<EstatisticasTempo>>(
      '/progresso-estudos/estatisticas-tempo',
      request
    );
    return data.data;
  },

  /**
   * Get evolution chart data
   */
  async getGraficoEvolucao(request: GraficoEvolucaoRequest): Promise<GraficoEvolucao> {
    const { data } = await authenticatedClient.post<ApiResponse<GraficoEvolucao>>(
      '/progresso-estudos/grafico-evolucao',
      request
    );
    return data.data;
  },

  /**
   * Generate progress report
   */
  async gerarRelatorio(request: RelatorioProgressoRequest): Promise<RelatorioProgresso> {
    const { data } = await authenticatedClient.post<ApiResponse<RelatorioProgresso>>(
      '/progresso-estudos/relatorio',
      request
    );
    return data.data;
  },

  /**
   * Update notification preferences
   */
  async atualizarPreferenciasNotificacao(
    request: PreferenciasNotificacaoRequest
  ): Promise<PreferenciasNotificacao> {
    const { data } = await authenticatedClient.put<ApiResponse<PreferenciasNotificacao>>(
      '/progresso-estudos/preferencias-notificacao',
      request
    );
    return data.data;
  },

  /**
   * Get period comparison data
   */
  async getComparacaoPeriodos(request: ComparacaoPeriodosRequest): Promise<ComparacaoPeriodos> {
    const { data } = await authenticatedClient.post<ApiResponse<ComparacaoPeriodos>>(
      '/progresso-estudos/comparacao-periodos',
      request
    );
    return data.data;
  },
};
