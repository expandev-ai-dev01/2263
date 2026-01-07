/**
 * @summary
 * Business logic for ProgressoEstudos entity.
 * Handles progress tracking operations using in-memory storage.
 * All validation and business logic is centralized here.
 *
 * @module services/progressoEstudos/progressoEstudosService
 */

import { PROGRESSO_ESTUDOS_DEFAULTS } from '@/constants';
import { progressoEstudosStore } from '@/instances';
import { ServiceError } from '@/utils';
import {
  DashboardProgressoGeral,
  EstatisticasTempoEstudo,
  GraficoEvolucao,
  AcompanhamentoMetas,
  RelatorioProgresso,
  PreferenciasNotificacao,
  ComparacaoPeriodos,
} from './progressoEstudosTypes';
import {
  dashboardRequestSchema,
  estatisticasTempoRequestSchema,
  graficoEvolucaoRequestSchema,
  relatorioProgressoRequestSchema,
  preferenciasNotificacaoRequestSchema,
  comparacaoPeriodosRequestSchema,
} from './progressoEstudosValidation';

/**
 * @summary
 * Gets dashboard data with general progress indicators.
 *
 * @function dashboardProgressoGet
 * @module services/progressoEstudos
 *
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<DashboardProgressoGeral>} Dashboard data
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 */
export async function dashboardProgressoGet(body: unknown): Promise<DashboardProgressoGeral> {
  const validation = dashboardRequestSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const { usuarioId } = validation.data;

  const conteudosConcluidos = progressoEstudosStore.getConteudosConcluidosByUsuario(usuarioId);
  const conteudosTotais = 100; // Mock value
  const progressoGeralPercentual =
    conteudosTotais > 0 ? (conteudosConcluidos.length / conteudosTotais) * 100 : 0;

  // Calculate streak
  const today = new Date();
  let streakDiasConsecutivos = 0;
  const sortedSessoes = progressoEstudosStore
    .getSessoesEstudoByUsuario(usuarioId)
    .sort((a, b) => new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime());

  for (let i = 0; i < sortedSessoes.length; i++) {
    const sessaoDate = new Date(sortedSessoes[i].dataInicio);
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (sessaoDate.toDateString() === expectedDate.toDateString()) {
      streakDiasConsecutivos++;
    } else {
      break;
    }
  }

  // Calculate recent content
  const diasRecentes = PROGRESSO_ESTUDOS_DEFAULTS.DIAS_RECENTES;
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() - diasRecentes);
  const conteudosAdicionadosRecentemente = 5; // Mock value

  return {
    progressoGeralPercentual: Number(progressoGeralPercentual.toFixed(2)),
    conteudosConcluidos: conteudosConcluidos.length,
    conteudosTotais,
    streakDiasConsecutivos,
    conteudosAdicionadosRecentemente,
  };
}

/**
 * @summary
 * Gets study time statistics by period.
 *
 * @function estatisticasTempoGet
 * @module services/progressoEstudos
 *
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<EstatisticasTempoEstudo>} Time statistics
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 */
export async function estatisticasTempoGet(body: unknown): Promise<EstatisticasTempoEstudo> {
  const validation = estatisticasTempoRequestSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const { usuarioId, periodoReferencia } = validation.data;

  const today = new Date();
  const sessoesEstudo = progressoEstudosStore.getSessoesEstudoByUsuario(usuarioId);

  // Calculate daily time
  const todayStr = today.toISOString().split('T')[0];
  const tempoEstudoDiario = sessoesEstudo
    .filter((s) => s.dataInicio.startsWith(todayStr))
    .reduce((sum, s) => sum + s.duracaoMinutos, 0);

  // Calculate weekly time
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const tempoEstudoSemanal = sessoesEstudo
    .filter((s) => new Date(s.dataInicio) >= weekAgo)
    .reduce((sum, s) => sum + s.duracaoMinutos, 0);

  // Calculate monthly time
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const tempoEstudoMensal = sessoesEstudo
    .filter((s) => new Date(s.dataInicio) >= monthStart)
    .reduce((sum, s) => sum + s.duracaoMinutos, 0);

  return {
    tempoEstudoDiario,
    tempoEstudoSemanal,
    tempoEstudoMensal,
    periodoReferencia,
  };
}

/**
 * @summary
 * Gets evolution chart data.
 *
 * @function graficoEvolucaoGet
 * @module services/progressoEstudos
 *
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<GraficoEvolucao>} Chart data
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 */
export async function graficoEvolucaoGet(body: unknown): Promise<GraficoEvolucao> {
  const validation = graficoEvolucaoRequestSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const { usuarioId, tipoGrafico, periodoGrafico, metricaExibida } = validation.data;

  // Mock data generation
  const dados = [];
  const today = new Date();
  let days = 7;

  if (periodoGrafico === '30dias') days = 30;
  else if (periodoGrafico === '90dias') days = 90;
  else if (periodoGrafico === '1ano') days = 365;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dados.push({
      data: date.toISOString().split('T')[0],
      valor: Math.floor(Math.random() * 100),
    });
  }

  return {
    tipoGrafico,
    periodoGrafico,
    metricaExibida,
    dados,
  };
}

/**
 * @summary
 * Generates progress report.
 *
 * @function relatorioProgressoGenerate
 * @module services/progressoEstudos
 *
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<RelatorioProgresso>} Report configuration
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 */
export async function relatorioProgressoGenerate(body: unknown): Promise<RelatorioProgresso> {
  const validation = relatorioProgressoRequestSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const {
    tipoRelatorio,
    formatoExportacao,
    periodoRelatorio,
    dataInicioPersonalizada,
    dataFimPersonalizada,
  } = validation.data;

  return {
    tipoRelatorio,
    formatoExportacao,
    periodoRelatorio,
    dataInicioPersonalizada,
    dataFimPersonalizada,
  };
}

/**
 * @summary
 * Updates notification preferences.
 *
 * @function preferenciasNotificacaoUpdate
 * @module services/progressoEstudos
 *
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<PreferenciasNotificacao>} Updated preferences
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 */
export async function preferenciasNotificacaoUpdate(
  body: unknown
): Promise<PreferenciasNotificacao> {
  const validation = preferenciasNotificacaoRequestSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const {
    usuarioId,
    notificacaoPushHabilitada,
    notificacaoEmailHabilitada,
    notificacaoSmsHabilitada,
    tiposMarcoHabilitados,
  } = validation.data;

  const preferencias = {
    usuarioId,
    notificacaoPushHabilitada,
    notificacaoEmailHabilitada,
    notificacaoSmsHabilitada,
    tiposMarcoHabilitados,
  };

  progressoEstudosStore.setPreferenciasNotificacao(preferencias);

  return {
    notificacaoPushHabilitada,
    notificacaoEmailHabilitada,
    notificacaoSmsHabilitada,
    tiposMarcoHabilitados,
  };
}

/**
 * @summary
 * Gets period comparison data.
 *
 * @function comparacaoPeriodosGet
 * @module services/progressoEstudos
 *
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<ComparacaoPeriodos>} Comparison data
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 */
export async function comparacaoPeriodosGet(body: unknown): Promise<ComparacaoPeriodos> {
  const validation = comparacaoPeriodosRequestSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const { periodoAtual, periodoComparacao, metricaComparacao } = validation.data;

  // Mock calculation
  const valorAtual = Math.floor(Math.random() * 100);
  const valorAnterior = Math.floor(Math.random() * 100);
  const variacaoPercentual =
    valorAnterior > 0 ? ((valorAtual - valorAnterior) / valorAnterior) * 100 : 0;

  return {
    periodoAtual,
    periodoComparacao,
    variacaoPercentual: Number(variacaoPercentual.toFixed(2)),
    metricaComparacao,
  };
}
