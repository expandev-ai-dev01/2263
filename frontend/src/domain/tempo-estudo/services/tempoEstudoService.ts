/**
 * @service TempoEstudoService
 * @domain tempo-estudo
 * @type REST API Service
 * @description Service for managing Tempo de Estudo operations
 */

import { authenticatedClient } from '@/core/lib/api';
import type {
  SessaoEstudo,
  RegistroManual,
  HistoricoSessao,
  EstatisticasTempo,
  IniciarSessaoDto,
  FinalizarSessaoDto,
  PausarSessaoDto,
  RetomarSessaoDto,
  CriarRegistroManualDto,
  AtualizarRegistroManualDto,
  EditarSessaoAutomaticaDto,
  ObterHistoricoParams,
  ObterEstatisticasParams,
} from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const tempoEstudoService = {
  /**
   * Iniciar nova sessão de estudo
   */
  async iniciarSessao(dto: IniciarSessaoDto): Promise<SessaoEstudo> {
    const { data } = await authenticatedClient.post<ApiResponse<SessaoEstudo>>(
      '/tempo-estudo/sessao/iniciar',
      dto
    );
    return data.data;
  },

  /**
   * Finalizar sessão de estudo ativa
   */
  async finalizarSessao(dto: FinalizarSessaoDto): Promise<SessaoEstudo> {
    const { data } = await authenticatedClient.post<ApiResponse<SessaoEstudo>>(
      '/tempo-estudo/sessao/finalizar',
      dto
    );
    return data.data;
  },

  /**
   * Pausar sessão de estudo ativa
   */
  async pausarSessao(dto: PausarSessaoDto): Promise<SessaoEstudo> {
    const { data } = await authenticatedClient.post<ApiResponse<SessaoEstudo>>(
      '/tempo-estudo/sessao/pausar',
      dto
    );
    return data.data;
  },

  /**
   * Retomar sessão de estudo pausada
   */
  async retomarSessao(dto: RetomarSessaoDto): Promise<SessaoEstudo> {
    const { data } = await authenticatedClient.post<ApiResponse<SessaoEstudo>>(
      '/tempo-estudo/sessao/retomar',
      dto
    );
    return data.data;
  },

  /**
   * Criar registro manual de tempo
   */
  async criarRegistroManual(dto: CriarRegistroManualDto): Promise<RegistroManual> {
    const { data } = await authenticatedClient.post<ApiResponse<RegistroManual>>(
      '/tempo-estudo/registro-manual',
      dto
    );
    return data.data;
  },

  /**
   * Atualizar registro manual existente
   */
  async atualizarRegistroManual(
    id: number,
    dto: AtualizarRegistroManualDto
  ): Promise<RegistroManual> {
    const { data } = await authenticatedClient.put<ApiResponse<RegistroManual>>(
      `/tempo-estudo/registro-manual/${id}`,
      dto
    );
    return data.data;
  },

  /**
   * Deletar registro manual
   */
  async deletarRegistroManual(id: number): Promise<{ message: string }> {
    const { data } = await authenticatedClient.delete<ApiResponse<{ message: string }>>(
      `/tempo-estudo/registro-manual/${id}`
    );
    return data.data;
  },

  /**
   * Editar sessão automática
   */
  async editarSessaoAutomatica(dto: EditarSessaoAutomaticaDto): Promise<SessaoEstudo> {
    const { data } = await authenticatedClient.put<ApiResponse<SessaoEstudo>>(
      '/tempo-estudo/sessao-automatica',
      dto
    );
    return data.data;
  },

  /**
   * Obter histórico de sessões
   */
  async obterHistorico(params: ObterHistoricoParams): Promise<HistoricoSessao[]> {
    const { data } = await authenticatedClient.get<ApiResponse<HistoricoSessao[]>>(
      '/tempo-estudo/historico',
      { params }
    );
    return data.data;
  },

  /**
   * Obter estatísticas de tempo
   */
  async obterEstatisticas(params: ObterEstatisticasParams): Promise<EstatisticasTempo> {
    const { data } = await authenticatedClient.get<ApiResponse<EstatisticasTempo>>(
      '/tempo-estudo/estatisticas',
      { params }
    );
    return data.data;
  },
};
