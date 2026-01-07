/**
 * @summary
 * Default values and constants for ProgressoEstudos entity.
 * Provides centralized configuration for progress tracking, metrics,
 * and notification settings.
 *
 * @module constants/progressoEstudos/progressoEstudosDefaults
 */

/**
 * @interface ProgressoEstudosDefaultsType
 * @description Default configuration values for progress tracking.
 *
 * @property {number} TEMPO_MINIMO_SESSAO - Minimum session duration in minutes (15)
 * @property {number} MULTIPLO_TEMPO - Time must be multiple of this value (15)
 * @property {number} MAX_RECORDS - Maximum allowed records in memory (10000)
 * @property {number} DIAS_RECENTES - Days to consider for recent content (7)
 */
export const PROGRESSO_ESTUDOS_DEFAULTS = {
  /** Minimum session duration in minutes */
  TEMPO_MINIMO_SESSAO: 15,
  /** Time must be multiple of this value */
  MULTIPLO_TEMPO: 15,
  /** Maximum allowed records in memory */
  MAX_RECORDS: 10000,
  /** Days to consider for recent content */
  DIAS_RECENTES: 7,
} as const;

/** Type representing the PROGRESSO_ESTUDOS_DEFAULTS constant */
export type ProgressoEstudosDefaultsType = typeof PROGRESSO_ESTUDOS_DEFAULTS;

/**
 * @interface PeriodoReferenciaType
 * @description Available time periods for statistics.
 *
 * @property {string} DIARIO - Daily period ('diario')
 * @property {string} SEMANAL - Weekly period ('semanal')
 * @property {string} MENSAL - Monthly period ('mensal')
 */
export const PERIODO_REFERENCIA = {
  DIARIO: 'diario',
  SEMANAL: 'semanal',
  MENSAL: 'mensal',
} as const;

/** Type representing the PERIODO_REFERENCIA constant */
export type PeriodoReferenciaType = typeof PERIODO_REFERENCIA;

/** Union type of all valid period values */
export type PeriodoReferencia = (typeof PERIODO_REFERENCIA)[keyof typeof PERIODO_REFERENCIA];

/**
 * @interface TipoGraficoType
 * @description Available chart types for visualization.
 *
 * @property {string} LINHA - Line chart ('linha')
 * @property {string} BARRA - Bar chart ('barra')
 * @property {string} AREA - Area chart ('area')
 */
export const TIPO_GRAFICO = {
  LINHA: 'linha',
  BARRA: 'barra',
  AREA: 'area',
} as const;

/** Type representing the TIPO_GRAFICO constant */
export type TipoGraficoType = typeof TIPO_GRAFICO;

/** Union type of all valid chart types */
export type TipoGrafico = (typeof TIPO_GRAFICO)[keyof typeof TIPO_GRAFICO];

/**
 * @interface PeriodoGraficoType
 * @description Available time periods for charts.
 *
 * @property {string} SETE_DIAS - 7 days ('7dias')
 * @property {string} TRINTA_DIAS - 30 days ('30dias')
 * @property {string} NOVENTA_DIAS - 90 days ('90dias')
 * @property {string} UM_ANO - 1 year ('1ano')
 */
export const PERIODO_GRAFICO = {
  SETE_DIAS: '7dias',
  TRINTA_DIAS: '30dias',
  NOVENTA_DIAS: '90dias',
  UM_ANO: '1ano',
} as const;

/** Type representing the PERIODO_GRAFICO constant */
export type PeriodoGraficoType = typeof PERIODO_GRAFICO;

/** Union type of all valid chart period values */
export type PeriodoGrafico = (typeof PERIODO_GRAFICO)[keyof typeof PERIODO_GRAFICO];

/**
 * @interface MetricaExibidaType
 * @description Available metrics for visualization.
 *
 * @property {string} TEMPO_ESTUDO - Study time metric ('tempo_estudo')
 * @property {string} CONTEUDOS_CONCLUIDOS - Completed content metric ('conteudos_concluidos')
 * @property {string} DESEMPENHO_QUESTOES - Questions performance metric ('desempenho_questoes')
 * @property {string} PERCENTUAL_ACERTOS - Success rate metric ('percentual_acertos')
 * @property {string} QUESTOES_RESOLVIDAS - Solved questions metric ('questoes_resolvidas')
 */
export const METRICA_EXIBIDA = {
  TEMPO_ESTUDO: 'tempo_estudo',
  CONTEUDOS_CONCLUIDOS: 'conteudos_concluidos',
  DESEMPENHO_QUESTOES: 'desempenho_questoes',
  PERCENTUAL_ACERTOS: 'percentual_acertos',
  QUESTOES_RESOLVIDAS: 'questoes_resolvidas',
} as const;

/** Type representing the METRICA_EXIBIDA constant */
export type MetricaExibidaType = typeof METRICA_EXIBIDA;

/** Union type of all valid metric values */
export type MetricaExibida = (typeof METRICA_EXIBIDA)[keyof typeof METRICA_EXIBIDA];

/**
 * @interface TipoRelatorioType
 * @description Available report types.
 *
 * @property {string} COMPLETO - Complete report ('completo')
 * @property {string} RESUMIDO - Summary report ('resumido')
 * @property {string} PERSONALIZADO - Custom report ('personalizado')
 */
export const TIPO_RELATORIO = {
  COMPLETO: 'completo',
  RESUMIDO: 'resumido',
  PERSONALIZADO: 'personalizado',
} as const;

/** Type representing the TIPO_RELATORIO constant */
export type TipoRelatorioType = typeof TIPO_RELATORIO;

/** Union type of all valid report types */
export type TipoRelatorio = (typeof TIPO_RELATORIO)[keyof typeof TIPO_RELATORIO];

/**
 * @interface FormatoExportacaoType
 * @description Available export formats.
 *
 * @property {string} PDF - PDF format ('pdf')
 * @property {string} EXCEL - Excel format ('excel')
 * @property {string} ODS - OpenDocument format ('ods')
 * @property {string} CSV - CSV format ('csv')
 */
export const FORMATO_EXPORTACAO = {
  PDF: 'pdf',
  EXCEL: 'excel',
  ODS: 'ods',
  CSV: 'csv',
} as const;

/** Type representing the FORMATO_EXPORTACAO constant */
export type FormatoExportacaoType = typeof FORMATO_EXPORTACAO;

/** Union type of all valid export formats */
export type FormatoExportacao = (typeof FORMATO_EXPORTACAO)[keyof typeof FORMATO_EXPORTACAO];

/**
 * @interface PeriodoRelatorioType
 * @description Available report periods.
 *
 * @property {string} ULTIMA_SEMANA - Last week ('ultima_semana')
 * @property {string} ULTIMO_MES - Last month ('ultimo_mes')
 * @property {string} ULTIMOS_3_MESES - Last 3 months ('ultimos_3_meses')
 * @property {string} PERSONALIZADO - Custom period ('personalizado')
 */
export const PERIODO_RELATORIO = {
  ULTIMA_SEMANA: 'ultima_semana',
  ULTIMO_MES: 'ultimo_mes',
  ULTIMOS_3_MESES: 'ultimos_3_meses',
  PERSONALIZADO: 'personalizado',
} as const;

/** Type representing the PERIODO_RELATORIO constant */
export type PeriodoRelatorioType = typeof PERIODO_RELATORIO;

/** Union type of all valid report period values */
export type PeriodoRelatorio = (typeof PERIODO_RELATORIO)[keyof typeof PERIODO_RELATORIO];

/**
 * @interface TipoMarcoType
 * @description Available milestone types.
 *
 * @property {string} META_ATINGIDA - Goal achieved ('meta_atingida')
 * @property {string} STREAK_MILESTONE - Streak milestone ('streak_milestone')
 * @property {string} PROGRESSO_PERCENTUAL - Progress percentage ('progresso_percentual')
 */
export const TIPO_MARCO = {
  META_ATINGIDA: 'meta_atingida',
  STREAK_MILESTONE: 'streak_milestone',
  PROGRESSO_PERCENTUAL: 'progresso_percentual',
} as const;

/** Type representing the TIPO_MARCO constant */
export type TipoMarcoType = typeof TIPO_MARCO;

/** Union type of all valid milestone types */
export type TipoMarco = (typeof TIPO_MARCO)[keyof typeof TIPO_MARCO];

/**
 * @interface CanalNotificacaoType
 * @description Available notification channels.
 *
 * @property {string} PUSH - Push notification ('push')
 * @property {string} EMAIL - Email notification ('email')
 * @property {string} SMS - SMS notification ('sms')
 */
export const CANAL_NOTIFICACAO = {
  PUSH: 'push',
  EMAIL: 'email',
  SMS: 'sms',
} as const;

/** Type representing the CANAL_NOTIFICACAO constant */
export type CanalNotificacaoType = typeof CANAL_NOTIFICACAO;

/** Union type of all valid notification channels */
export type CanalNotificacao = (typeof CANAL_NOTIFICACAO)[keyof typeof CANAL_NOTIFICACAO];

/**
 * @interface StatusEnvioType
 * @description Available notification send status.
 *
 * @property {string} SUCESSO - Success status ('sucesso')
 * @property {string} FALHA - Failure status ('falha')
 * @property {string} PENDENTE - Pending status ('pendente')
 */
export const STATUS_ENVIO = {
  SUCESSO: 'sucesso',
  FALHA: 'falha',
  PENDENTE: 'pendente',
} as const;

/** Type representing the STATUS_ENVIO constant */
export type StatusEnvioType = typeof STATUS_ENVIO;

/** Union type of all valid send status values */
export type StatusEnvio = (typeof STATUS_ENVIO)[keyof typeof STATUS_ENVIO];

/**
 * @interface PeriodoComparacaoType
 * @description Available comparison periods.
 *
 * @property {string} ESTA_SEMANA - This week ('esta_semana')
 * @property {string} ESTE_MES - This month ('este_mes')
 * @property {string} ESTE_TRIMESTRE - This quarter ('este_trimestre')
 * @property {string} SEMANA_ANTERIOR - Previous week ('semana_anterior')
 * @property {string} MES_ANTERIOR - Previous month ('mes_anterior')
 * @property {string} TRIMESTRE_ANTERIOR - Previous quarter ('trimestre_anterior')
 */
export const PERIODO_COMPARACAO = {
  ESTA_SEMANA: 'esta_semana',
  ESTE_MES: 'este_mes',
  ESTE_TRIMESTRE: 'este_trimestre',
  SEMANA_ANTERIOR: 'semana_anterior',
  MES_ANTERIOR: 'mes_anterior',
  TRIMESTRE_ANTERIOR: 'trimestre_anterior',
} as const;

/** Type representing the PERIODO_COMPARACAO constant */
export type PeriodoComparacaoType = typeof PERIODO_COMPARACAO;

/** Union type of all valid comparison period values */
export type PeriodoComparacao = (typeof PERIODO_COMPARACAO)[keyof typeof PERIODO_COMPARACAO];
