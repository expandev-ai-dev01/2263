/**
 * @summary
 * Default values and constants for TempoEstudo entity.
 * Provides centralized configuration for session management, time tracking,
 * and validation limits.
 *
 * @module constants/tempoEstudo/tempoEstudoDefaults
 */

/**
 * @interface TempoEstudoDefaultsType
 * @description Default configuration values for time tracking.
 *
 * @property {number} TEMPO_MINIMO_SESSAO - Minimum session duration in minutes (1)
 * @property {number} TEMPO_MAXIMO_SESSAO - Maximum session duration in minutes (720 = 12 hours)
 * @property {number} TEMPO_MINIMO_REGISTRO_MANUAL - Minimum manual record duration in minutes (15)
 * @property {number} TEMPO_MAXIMO_PAUSA - Maximum pause duration in minutes (1440 = 24 hours)
 * @property {number} DIAS_EDICAO_REGISTRO_MANUAL - Days allowed to edit manual records (7)
 * @property {number} HORAS_EDICAO_SESSAO_AUTOMATICA - Hours allowed to edit automatic sessions (24)
 * @property {number} DIAS_HISTORICO_MAXIMO - Maximum days for historical data (365)
 * @property {number} LIMITE_HORAS_DIA - Maximum study hours per day (12)
 */
export const TEMPO_ESTUDO_DEFAULTS = {
  /** Minimum session duration in minutes */
  TEMPO_MINIMO_SESSAO: 1,
  /** Maximum session duration in minutes (12 hours) */
  TEMPO_MAXIMO_SESSAO: 720,
  /** Minimum manual record duration in minutes */
  TEMPO_MINIMO_REGISTRO_MANUAL: 15,
  /** Maximum pause duration in minutes (24 hours) */
  TEMPO_MAXIMO_PAUSA: 1440,
  /** Days allowed to edit manual records */
  DIAS_EDICAO_REGISTRO_MANUAL: 7,
  /** Hours allowed to edit automatic sessions */
  HORAS_EDICAO_SESSAO_AUTOMATICA: 24,
  /** Maximum days for historical data */
  DIAS_HISTORICO_MAXIMO: 365,
  /** Maximum study hours per day */
  LIMITE_HORAS_DIA: 12,
} as const;

/** Type representing the TEMPO_ESTUDO_DEFAULTS constant */
export type TempoEstudoDefaultsType = typeof TEMPO_ESTUDO_DEFAULTS;

/**
 * @interface StatusSessaoType
 * @description Available status values for study sessions.
 *
 * @property {string} ACTIVE - Active session ('active')
 * @property {string} PAUSED - Paused session ('paused')
 * @property {string} COMPLETED - Completed session ('completed')
 * @property {string} INTERRUPTED - Interrupted session ('interrupted')
 */
export const STATUS_SESSAO = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  INTERRUPTED: 'interrupted',
} as const;

/** Type representing the STATUS_SESSAO constant */
export type StatusSessaoType = typeof STATUS_SESSAO;

/** Union type of all valid session status values */
export type StatusSessao = (typeof STATUS_SESSAO)[keyof typeof STATUS_SESSAO];

/**
 * @interface MotivoInterrupcaoType
 * @description Available interruption reasons.
 *
 * @property {string} USER_STOPPED - User manually stopped ('user_stopped')
 * @property {string} TIMEOUT - Session timeout ('timeout')
 * @property {string} SYSTEM_ERROR - System error ('system_error')
 */
export const MOTIVO_INTERRUPCAO = {
  USER_STOPPED: 'user_stopped',
  TIMEOUT: 'timeout',
  SYSTEM_ERROR: 'system_error',
} as const;

/** Type representing the MOTIVO_INTERRUPCAO constant */
export type MotivoInterrupcaoType = typeof MOTIVO_INTERRUPCAO;

/** Union type of all valid interruption reasons */
export type MotivoInterrupcao = (typeof MOTIVO_INTERRUPCAO)[keyof typeof MOTIVO_INTERRUPCAO];

/**
 * @interface MotivoEdicaoType
 * @description Available edit reasons for automatic sessions.
 *
 * @property {string} INTERRUPTION_CORRECTION - Correction of interruption ('interruption_correction')
 * @property {string} TIME_ADJUSTMENT - Time adjustment ('time_adjustment')
 * @property {string} SUBJECT_CORRECTION - Subject correction ('subject_correction')
 */
export const MOTIVO_EDICAO = {
  INTERRUPTION_CORRECTION: 'interruption_correction',
  TIME_ADJUSTMENT: 'time_adjustment',
  SUBJECT_CORRECTION: 'subject_correction',
} as const;

/** Type representing the MOTIVO_EDICAO constant */
export type MotivoEdicaoType = typeof MOTIVO_EDICAO;

/** Union type of all valid edit reasons */
export type MotivoEdicao = (typeof MOTIVO_EDICAO)[keyof typeof MOTIVO_EDICAO];
