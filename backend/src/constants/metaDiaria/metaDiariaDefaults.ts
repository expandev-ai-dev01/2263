/**
 * @summary
 * Default values and constants for MetaDiaria entity.
 * Provides centralized configuration for entity creation, validation limits,
 * and priority level definitions.
 *
 * @module constants/metaDiaria/metaDiariaDefaults
 */

/**
 * @interface MetaDiariaDefaultsType
 * @description Default configuration values applied when creating new MetaDiaria entities.
 *
 * @property {string} STATUS - Default status for new records ('ativa')
 * @property {string} PRIORIDADE - Default priority for new records ('media')
 * @property {number} TEMPO_MINIMO_SESSAO - Minimum session duration in minutes (15)
 * @property {number} MULTIPLO_TEMPO - Time must be multiple of this value (15)
 * @property {number} MAX_HORARIOS_PREFERENCIAIS - Maximum preferred time slots (20)
 * @property {number} MAX_MATERIAS - Maximum subjects per goal (20)
 * @property {number} MAX_TOPICOS - Maximum topics per goal (30)
 */
export const META_DIARIA_DEFAULTS = {
  /** Default status for new records */
  STATUS: 'ativa' as const,
  /** Default priority for new records */
  PRIORIDADE: 'media' as const,
  /** Minimum session duration in minutes */
  TEMPO_MINIMO_SESSAO: 15,
  /** Time must be multiple of this value */
  MULTIPLO_TEMPO: 15,
  /** Maximum preferred time slots */
  MAX_HORARIOS_PREFERENCIAIS: 20,
  /** Maximum subjects per goal */
  MAX_MATERIAS: 20,
  /** Maximum topics per goal */
  MAX_TOPICOS: 30,
} as const;

/** Type representing the META_DIARIA_DEFAULTS constant */
export type MetaDiariaDefaultsType = typeof META_DIARIA_DEFAULTS;

/**
 * @interface MetaDiariaPrioridadesType
 * @description Available priority levels for MetaDiaria entities.
 *
 * @property {string} ALTA - High priority level ('alta')
 * @property {string} MEDIA - Medium priority level ('media')
 * @property {string} BAIXA - Low priority level ('baixa')
 */
export const META_DIARIA_PRIORIDADES = {
  ALTA: 'alta',
  MEDIA: 'media',
  BAIXA: 'baixa',
} as const;

/** Type representing the META_DIARIA_PRIORIDADES constant */
export type MetaDiariaPrioridadesType = typeof META_DIARIA_PRIORIDADES;

/** Union type of all valid priority values */
export type MetaDiariaPrioridade =
  (typeof META_DIARIA_PRIORIDADES)[keyof typeof META_DIARIA_PRIORIDADES];

/**
 * @interface MetaDiariaStatusType
 * @description Available status values for MetaDiaria entities.
 *
 * @property {string} ATIVA - Active status ('ativa')
 * @property {string} INATIVA - Inactive status ('inativa')
 * @property {string} CONCLUIDA - Completed status ('concluida')
 */
export const META_DIARIA_STATUS = {
  ATIVA: 'ativa',
  INATIVA: 'inativa',
  CONCLUIDA: 'concluida',
} as const;

/** Type representing the META_DIARIA_STATUS constant */
export type MetaDiariaStatusType = typeof META_DIARIA_STATUS;

/** Union type of all valid status values */
export type MetaDiariaStatus = (typeof META_DIARIA_STATUS)[keyof typeof META_DIARIA_STATUS];

/**
 * @interface MetaDiariaLimitsType
 * @description Validation constraints for MetaDiaria entity fields.
 *
 * @property {number} TITULO_MIN_LENGTH - Minimum characters for title field (3)
 * @property {number} TITULO_MAX_LENGTH - Maximum characters for title field (100)
 * @property {number} TOPICO_MIN_LENGTH - Minimum characters for topic field (3)
 * @property {number} TOPICO_MAX_LENGTH - Maximum characters for topic field (100)
 */
export const META_DIARIA_LIMITS = {
  TITULO_MIN_LENGTH: 3,
  TITULO_MAX_LENGTH: 100,
  TOPICO_MIN_LENGTH: 3,
  TOPICO_MAX_LENGTH: 100,
} as const;

/** Type representing the META_DIARIA_LIMITS constant */
export type MetaDiariaLimitsType = typeof META_DIARIA_LIMITS;
