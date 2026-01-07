/**
 * @summary
 * Type definitions for Disciplina entity.
 *
 * @module services/disciplina/disciplinaTypes
 */

/**
 * @interface DisciplinaEntity
 * @description Represents a disciplina entity
 *
 * @property {string} id - Unique identifier (UUID)
 * @property {string} nomeDisciplina - Disciplina name
 * @property {string|null} descricao - Disciplina description
 * @property {string|null} disciplinaPaiId - Parent disciplina ID (null for root)
 * @property {number} ordemExibicao - Display order
 * @property {boolean} ativa - Active status
 * @property {boolean} possuiSubdisciplinas - Has active subdisciplinas
 * @property {string} dataCriacao - Creation timestamp (ISO 8601)
 * @property {string} dataAtualizacao - Last update timestamp (ISO 8601)
 */
export interface DisciplinaEntity {
  id: string;
  nomeDisciplina: string;
  descricao: string | null;
  disciplinaPaiId: string | null;
  ordemExibicao: number;
  ativa: boolean;
  possuiSubdisciplinas: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

/**
 * @interface DisciplinaCreateRequest
 * @description Request payload for creating a disciplina
 *
 * @property {string} nomeDisciplina - Disciplina name (3-100 chars)
 * @property {string|null} descricao - Disciplina description (max 500 chars)
 * @property {string|null} disciplinaPaiId - Parent disciplina ID (optional)
 * @property {number} ordemExibicao - Display order
 * @property {boolean} ativa - Active status
 */
export interface DisciplinaCreateRequest {
  nomeDisciplina: string;
  descricao: string | null;
  disciplinaPaiId: string | null;
  ordemExibicao: number;
  ativa: boolean;
}

/**
 * @interface DisciplinaUpdateRequest
 * @description Request payload for updating a disciplina
 *
 * @property {string} nomeDisciplina - Disciplina name (3-100 chars)
 * @property {string|null} descricao - Disciplina description (max 500 chars)
 * @property {number} ordemExibicao - Display order
 * @property {boolean} ativa - Active status
 */
export interface DisciplinaUpdateRequest {
  nomeDisciplina: string;
  descricao: string | null;
  ordemExibicao: number;
  ativa: boolean;
}

/**
 * @interface DisciplinaListResponse
 * @description Response structure for listing disciplinas
 *
 * @property {string} id - Unique identifier
 * @property {string} nomeDisciplina - Disciplina name
 * @property {string|null} disciplinaPaiId - Parent disciplina ID
 * @property {number} ordemExibicao - Display order
 * @property {boolean} ativa - Active status
 * @property {boolean} possuiSubdisciplinas - Has active subdisciplinas
 * @property {string} dataCriacao - Creation timestamp (ISO 8601)
 */
export interface DisciplinaListResponse {
  id: string;
  nomeDisciplina: string;
  disciplinaPaiId: string | null;
  ordemExibicao: number;
  ativa: boolean;
  possuiSubdisciplinas: boolean;
  dataCriacao: string;
}

/**
 * @interface DisciplinaDeleteRequest
 * @description Request payload for deleting a disciplina
 *
 * @property {boolean} confirmacaoExclusao - Explicit deletion confirmation
 * @property {string|null} motivoExclusao - Reason for deletion (optional)
 */
export interface DisciplinaDeleteRequest {
  confirmacaoExclusao: boolean;
  motivoExclusao: string | null;
}

/**
 * @interface DisciplinaHierarchyMoveRequest
 * @description Request payload for moving disciplina in hierarchy
 *
 * @property {string|null} novoPaiId - New parent disciplina ID (null for root)
 * @property {number} novaPosicao - New position in order
 */
export interface DisciplinaHierarchyMoveRequest {
  novoPaiId: string | null;
  novaPosicao: number;
}
