/**
 * @summary
 * Default values and constants for MaterialDidatico entity.
 * Provides centralized configuration for entity creation, validation limits,
 * and difficulty level definitions.
 *
 * @module constants/materialDidatico/materialDidaticoDefaults
 */

/**
 * @interface MaterialDidaticoDefaultsType
 * @description Default configuration values applied when creating new MaterialDidatico entities.
 *
 * @property {string} STATUS - Default status for new records ('ativo')
 * @property {string} NIVEL_DIFICULDADE - Default difficulty level for new records ('basico')
 * @property {number} MAX_FILE_SIZE_MB - Maximum allowed file size in MB (50)
 * @property {number} MAX_TAGS - Maximum number of tags per material (10)
 */
export const MATERIAL_DIDATICO_DEFAULTS = {
  /** Default status for new records */
  STATUS: 'ativo' as const,
  /** Default difficulty level for new records */
  NIVEL_DIFICULDADE: 'basico' as const,
  /** Maximum allowed file size in MB */
  MAX_FILE_SIZE_MB: 50,
  /** Maximum number of tags per material */
  MAX_TAGS: 10,
} as const;

/** Type representing the MATERIAL_DIDATICO_DEFAULTS constant */
export type MaterialDidaticoDefaultsType = typeof MATERIAL_DIDATICO_DEFAULTS;

/**
 * @interface MaterialDidaticoNiveisType
 * @description Available difficulty levels for MaterialDidatico entities.
 *
 * @property {string} BASICO - Basic difficulty level ('basico')
 * @property {string} INTERMEDIARIO - Intermediate difficulty level ('intermediario')
 * @property {string} AVANCADO - Advanced difficulty level ('avancado')
 */
export const MATERIAL_DIDATICO_NIVEIS = {
  BASICO: 'basico',
  INTERMEDIARIO: 'intermediario',
  AVANCADO: 'avancado',
} as const;

/** Type representing the MATERIAL_DIDATICO_NIVEIS constant */
export type MaterialDidaticoNiveisType = typeof MATERIAL_DIDATICO_NIVEIS;

/** Union type of all valid difficulty level values */
export type MaterialDidaticoNivel =
  (typeof MATERIAL_DIDATICO_NIVEIS)[keyof typeof MATERIAL_DIDATICO_NIVEIS];

/**
 * @interface MaterialDidaticoStatusType
 * @description Available status values for MaterialDidatico entities.
 *
 * @property {string} ATIVO - Active status ('ativo')
 * @property {string} INATIVO - Inactive status ('inativo')
 * @property {string} PROCESSANDO - Processing status ('processando')
 */
export const MATERIAL_DIDATICO_STATUS = {
  ATIVO: 'ativo',
  INATIVO: 'inativo',
  PROCESSANDO: 'processando',
} as const;

/** Type representing the MATERIAL_DIDATICO_STATUS constant */
export type MaterialDidaticoStatusType = typeof MATERIAL_DIDATICO_STATUS;

/** Union type of all valid status values */
export type MaterialDidaticoStatus =
  (typeof MATERIAL_DIDATICO_STATUS)[keyof typeof MATERIAL_DIDATICO_STATUS];

/**
 * @interface MaterialDidaticoLimitsType
 * @description Validation constraints for MaterialDidatico entity fields.
 *
 * @property {number} TITULO_MIN_LENGTH - Minimum characters for title field (5)
 * @property {number} TITULO_MAX_LENGTH - Maximum characters for title field (200)
 * @property {number} DESCRICAO_MAX_LENGTH - Maximum characters for description field (1000)
 * @property {number} TAG_MIN_LENGTH - Minimum characters for each tag (2)
 * @property {number} TAG_MAX_LENGTH - Maximum characters for each tag (30)
 * @property {number} ARQUIVO_NOME_MAX_LENGTH - Maximum characters for file name (255)
 */
export const MATERIAL_DIDATICO_LIMITS = {
  TITULO_MIN_LENGTH: 5,
  TITULO_MAX_LENGTH: 200,
  DESCRICAO_MAX_LENGTH: 1000,
  TAG_MIN_LENGTH: 2,
  TAG_MAX_LENGTH: 30,
  ARQUIVO_NOME_MAX_LENGTH: 255,
} as const;

/** Type representing the MATERIAL_DIDATICO_LIMITS constant */
export type MaterialDidaticoLimitsType = typeof MATERIAL_DIDATICO_LIMITS;
