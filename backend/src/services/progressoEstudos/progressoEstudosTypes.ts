/**
 * @summary
 * Type definitions for ProgressoEstudos entity.
 *
 * @module services/progressoEstudos/progressoEstudosTypes
 */

import {
  PeriodoReferencia,
  TipoGrafico,
  PeriodoGrafico,
  MetricaExibida,
  TipoRelatorio,
  FormatoExportacao,
  PeriodoRelatorio,
  TipoMarco,
  CanalNotificacao,
  StatusEnvio,
  PeriodoComparacao,
} from '@/constants';

/**
 * @interface DashboardProgressoGeral
 * @description Dashboard data with general progress indicators
 */
export interface DashboardProgressoGeral {
  progressoGeralPercentual: number;
  conteudosConcluidos: number;
  conteudosTotais: number;
  streakDiasConsecutivos: number;
  conteudosAdicionadosRecentemente: number;
}

/**
 * @interface EstatisticasTempoEstudo
 * @description Study time statistics by period
 */
export interface EstatisticasTempoEstudo {
  tempoEstudoDiario: number;
  tempoEstudoSemanal: number;
  tempoEstudoMensal: number;
  periodoReferencia: PeriodoReferencia;
}

/**
 * @interface GraficoEvolucao
 * @description Chart data for progress evolution
 */
export interface GraficoEvolucao {
  tipoGrafico: TipoGrafico;
  periodoGrafico: PeriodoGrafico;
  metricaExibida: MetricaExibida;
  dados: Array<{
    data: string;
    valor: number;
  }>;
}

/**
 * @interface FiltrosProgresso
 * @description Filters for progress data
 */
export interface FiltrosProgresso {
  filtroMateria?: string;
  filtroDisciplina?: string;
  filtroCategoria?: string;
}

/**
 * @interface AcompanhamentoMetas
 * @description Goal tracking data
 */
export interface AcompanhamentoMetas {
  metaTempoDiario?: number;
  metaConteudosDiarios?: number;
  percentualCumprimentoTempo: number;
  percentualCumprimentoConteudos: number;
}

/**
 * @interface RelatorioProgresso
 * @description Progress report configuration
 */
export interface RelatorioProgresso {
  tipoRelatorio: TipoRelatorio;
  formatoExportacao: FormatoExportacao;
  periodoRelatorio: PeriodoRelatorio;
  dataInicioPersonalizada?: string;
  dataFimPersonalizada?: string;
}

/**
 * @interface NotificacaoMarco
 * @description Milestone notification data
 */
export interface NotificacaoMarco {
  id: number;
  usuarioId: number;
  tipoMarco: TipoMarco;
  descricaoMarco: string;
  dataMarco: string;
  notificacaoEnviada: boolean;
  canaisNotificacao: CanalNotificacao[];
  tentativasEnvio: number;
  statusEnvioPorCanal: { [canal: string]: StatusEnvio };
}

/**
 * @interface PreferenciasNotificacao
 * @description User notification preferences
 */
export interface PreferenciasNotificacao {
  notificacaoPushHabilitada: boolean;
  notificacaoEmailHabilitada: boolean;
  notificacaoSmsHabilitada: boolean;
  tiposMarcoHabilitados: TipoMarco[];
}

/**
 * @interface ComparacaoPeriodos
 * @description Period comparison data
 */
export interface ComparacaoPeriodos {
  periodoAtual: PeriodoComparacao;
  periodoComparacao: PeriodoComparacao;
  variacaoPercentual: number;
  metricaComparacao: MetricaExibida;
}

/**
 * @interface DashboardProgressoRequest
 * @description Request for dashboard data
 */
export interface DashboardProgressoRequest {
  usuarioId: number;
}

/**
 * @interface EstatisticasTempoRequest
 * @description Request for time statistics
 */
export interface EstatisticasTempoRequest {
  usuarioId: number;
  periodoReferencia: PeriodoReferencia;
}

/**
 * @interface GraficoEvolucaoRequest
 * @description Request for evolution chart
 */
export interface GraficoEvolucaoRequest {
  usuarioId: number;
  tipoGrafico: TipoGrafico;
  periodoGrafico: PeriodoGrafico;
  metricaExibida: MetricaExibida;
  filtros?: FiltrosProgresso;
}

/**
 * @interface RelatorioProgressoRequest
 * @description Request for progress report
 */
export interface RelatorioProgressoRequest {
  usuarioId: number;
  tipoRelatorio: TipoRelatorio;
  formatoExportacao: FormatoExportacao;
  periodoRelatorio: PeriodoRelatorio;
  dataInicioPersonalizada?: string;
  dataFimPersonalizada?: string;
  filtros?: FiltrosProgresso;
}

/**
 * @interface PreferenciasNotificacaoRequest
 * @description Request for updating notification preferences
 */
export interface PreferenciasNotificacaoRequest {
  usuarioId: number;
  notificacaoPushHabilitada: boolean;
  notificacaoEmailHabilitada: boolean;
  notificacaoSmsHabilitada: boolean;
  tiposMarcoHabilitados: TipoMarco[];
}

/**
 * @interface ComparacaoPeriodosRequest
 * @description Request for period comparison
 */
export interface ComparacaoPeriodosRequest {
  usuarioId: number;
  periodoAtual: PeriodoComparacao;
  periodoComparacao: PeriodoComparacao;
  metricaComparacao: MetricaExibida;
  filtros?: FiltrosProgresso;
}
