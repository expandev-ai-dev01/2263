/**
 * @summary
 * Default values and constants for Disciplina entity.
 * Provides centralized configuration for entity creation, validation limits,
 * and hierarchy level definitions.
 *
 * @module constants/disciplina/disciplinaDefaults
 */

/**
 * @interface DisciplinaDefaultsType
 * @description Default configuration values applied when creating new Disciplina entities.
 *
 * @property {boolean} ATIVA - Default active status for new records (true)
 * @property {number} MAX_HIERARCHY_LEVELS - Maximum hierarchy depth (3)
 * @property {number} ORDEM_INICIAL - Default initial order (1)
 */
export const DISCIPLINA_DEFAULTS = {
  /** Default active status for new records */
  ATIVA: true,
  /** Maximum hierarchy depth */
  MAX_HIERARCHY_LEVELS: 3,
  /** Default initial order */
  ORDEM_INICIAL: 1,
} as const;

/** Type representing the DISCIPLINA_DEFAULTS constant */
export type DisciplinaDefaultsType = typeof DISCIPLINA_DEFAULTS;

/**
 * @interface DisciplinaLimitsType
 * @description Validation constraints for Disciplina entity fields.
 *
 * @property {number} NOME_MIN_LENGTH - Minimum characters for name field (3)
 * @property {number} NOME_MAX_LENGTH - Maximum characters for name field (100)
 * @property {number} DESCRICAO_MAX_LENGTH - Maximum characters for description field (500)
 */
export const DISCIPLINA_LIMITS = {
  NOME_MIN_LENGTH: 3,
  NOME_MAX_LENGTH: 100,
  DESCRICAO_MAX_LENGTH: 500,
} as const;

/** Type representing the DISCIPLINA_LIMITS constant */
export type DisciplinaLimitsType = typeof DISCIPLINA_LIMITS;
