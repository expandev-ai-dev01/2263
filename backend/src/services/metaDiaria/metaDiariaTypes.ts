/**
 * @summary
 * Type definitions for MetaDiaria entity.
 *
 * @module services/metaDiaria/metaDiariaTypes
 */

import { MetaDiariaPrioridade, MetaDiariaStatus } from '@/constants';

/**
 * @interface HorarioPreferencial
 * @description Preferred time slot for study sessions
 *
 * @property {string} horarioInicio - Start time in HH:MM format
 * @property {string} horarioFim - End time in HH:MM format
 */
export interface HorarioPreferencial {
  horarioInicio: string;
  horarioFim: string;
}

/**
 * @interface MetaDiariaEntity
 * @description Represents a meta diária entity
 *
 * @property {number} id - Unique identifier
 * @property {number} usuarioId - User identifier
 * @property {string} dataMeta - Goal date (YYYY-MM-DD)
 * @property {string} tituloMeta - Goal title
 * @property {number|null} tempoTotalDesejado - Desired total time in minutes (optional)
 * @property {HorarioPreferencial[]} horariosPreferenciais - Preferred time slots
 * @property {number[]} materiasSelecionadas - Selected subject IDs
 * @property {string[]} topicosEspecificos - Specific topics
 * @property {MetaDiariaPrioridade} prioridade - Priority level
 * @property {MetaDiariaStatus} status - Goal status
 * @property {string} dataCriacao - Creation timestamp (ISO 8601)
 */
export interface MetaDiariaEntity {
  id: number;
  usuarioId: number;
  dataMeta: string;
  tituloMeta: string;
  tempoTotalDesejado: number | null;
  horariosPreferenciais: HorarioPreferencial[];
  materiasSelecionadas: number[];
  topicosEspecificos: string[];
  prioridade: MetaDiariaPrioridade;
  status: MetaDiariaStatus;
  dataCriacao: string;
}

/**
 * @interface MetaDiariaCreateRequest
 * @description Request payload for creating a meta diária
 *
 * @property {number} usuarioId - User identifier
 * @property {string} dataMeta - Goal date (YYYY-MM-DD)
 * @property {string} tituloMeta - Goal title (3-100 chars)
 * @property {number|null} tempoTotalDesejado - Desired total time in minutes (optional, multiple of 15)
 * @property {HorarioPreferencial[]} horariosPreferenciais - Preferred time slots (max 20)
 * @property {number[]} materiasSelecionadas - Selected subject IDs (1-20)
 * @property {string[]} topicosEspecificos - Specific topics (max 30, 3-100 chars each)
 * @property {MetaDiariaPrioridade} prioridade - Priority level
 */
export interface MetaDiariaCreateRequest {
  usuarioId: number;
  dataMeta: string;
  tituloMeta: string;
  tempoTotalDesejado: number | null;
  horariosPreferenciais: HorarioPreferencial[];
  materiasSelecionadas: number[];
  topicosEspecificos: string[];
  prioridade: MetaDiariaPrioridade;
}

/**
 * @interface MetaDiariaUpdateRequest
 * @description Request payload for updating a meta diária
 *
 * @property {string} tituloMeta - Goal title (3-100 chars)
 * @property {number|null} tempoTotalDesejado - Desired total time in minutes (optional, multiple of 15)
 * @property {HorarioPreferencial[]} horariosPreferenciais - Preferred time slots (max 20)
 * @property {number[]} materiasSelecionadas - Selected subject IDs (1-20)
 * @property {string[]} topicosEspecificos - Specific topics (max 30, 3-100 chars each)
 * @property {MetaDiariaPrioridade} prioridade - Priority level
 * @property {MetaDiariaStatus} status - Goal status
 */
export interface MetaDiariaUpdateRequest {
  tituloMeta: string;
  tempoTotalDesejado: number | null;
  horariosPreferenciais: HorarioPreferencial[];
  materiasSelecionadas: number[];
  topicosEspecificos: string[];
  prioridade: MetaDiariaPrioridade;
  status: MetaDiariaStatus;
}

/**
 * @interface MetaDiariaListResponse
 * @description Response structure for listing metas diárias
 *
 * @property {number} id - Unique identifier
 * @property {string} dataMeta - Goal date (YYYY-MM-DD)
 * @property {string} tituloMeta - Goal title
 * @property {MetaDiariaPrioridade} prioridade - Priority level
 * @property {MetaDiariaStatus} status - Goal status
 * @property {number} totalSessoes - Total number of sessions
 * @property {string} dataCriacao - Creation timestamp (ISO 8601)
 */
export interface MetaDiariaListResponse {
  id: number;
  dataMeta: string;
  tituloMeta: string;
  prioridade: MetaDiariaPrioridade;
  status: MetaDiariaStatus;
  totalSessoes: number;
  dataCriacao: string;
}
