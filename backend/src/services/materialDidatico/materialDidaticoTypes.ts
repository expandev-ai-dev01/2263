/**
 * @summary
 * Type definitions for MaterialDidatico entity.
 *
 * @module services/materialDidatico/materialDidaticoTypes
 */

import { MaterialDidaticoNivel, MaterialDidaticoStatus } from '@/constants';

/**
 * @interface MaterialDidaticoEntity
 * @description Represents a material didático entity
 *
 * @property {number} id - Unique identifier
 * @property {string} titulo - Material title
 * @property {number} editalId - Related edital identifier
 * @property {number} disciplinaId - Related disciplina identifier
 * @property {string|null} descricao - Material description
 * @property {string} arquivoPdf - PDF file path
 * @property {string[]} tags - Search keywords
 * @property {MaterialDidaticoNivel} nivelDificuldade - Difficulty level
 * @property {number} ordemApresentacao - Presentation order
 * @property {MaterialDidaticoStatus} status - Material status
 * @property {string} dataCadastro - Creation timestamp (ISO 8601)
 * @property {number} usuarioCadastro - User who created the material
 */
export interface MaterialDidaticoEntity {
  id: number;
  titulo: string;
  editalId: number;
  disciplinaId: number;
  descricao: string | null;
  arquivoPdf: string;
  tags: string[];
  nivelDificuldade: MaterialDidaticoNivel;
  ordemApresentacao: number;
  status: MaterialDidaticoStatus;
  dataCadastro: string;
  usuarioCadastro: number;
}

/**
 * @interface MaterialDidaticoCreateRequest
 * @description Request payload for creating a material didático
 *
 * @property {string} titulo - Material title (5-200 chars)
 * @property {number} editalId - Related edital identifier
 * @property {number} disciplinaId - Related disciplina identifier
 * @property {string|null} descricao - Material description (max 1000 chars)
 * @property {string} arquivoPdf - PDF file path
 * @property {string[]} tags - Search keywords (max 10 tags, 2-30 chars each)
 * @property {MaterialDidaticoNivel} nivelDificuldade - Difficulty level
 * @property {number} ordemApresentacao - Presentation order (optional, auto-calculated)
 * @property {number} usuarioCadastro - User creating the material
 */
export interface MaterialDidaticoCreateRequest {
  titulo: string;
  editalId: number;
  disciplinaId: number;
  descricao: string | null;
  arquivoPdf: string;
  tags: string[];
  nivelDificuldade: MaterialDidaticoNivel;
  ordemApresentacao?: number;
  usuarioCadastro: number;
}

/**
 * @interface MaterialDidaticoUpdateRequest
 * @description Request payload for updating a material didático
 *
 * @property {string} titulo - Material title (5-200 chars)
 * @property {string|null} descricao - Material description (max 1000 chars)
 * @property {string[]} tags - Search keywords (max 10 tags, 2-30 chars each)
 * @property {MaterialDidaticoNivel} nivelDificuldade - Difficulty level
 * @property {number} ordemApresentacao - Presentation order
 * @property {MaterialDidaticoStatus} status - Material status
 */
export interface MaterialDidaticoUpdateRequest {
  titulo: string;
  descricao: string | null;
  tags: string[];
  nivelDificuldade: MaterialDidaticoNivel;
  ordemApresentacao: number;
  status: MaterialDidaticoStatus;
}

/**
 * @interface MaterialDidaticoListResponse
 * @description Response structure for listing materiais didáticos
 *
 * @property {number} id - Unique identifier
 * @property {string} titulo - Material title
 * @property {number} editalId - Related edital identifier
 * @property {number} disciplinaId - Related disciplina identifier
 * @property {MaterialDidaticoNivel} nivelDificuldade - Difficulty level
 * @property {MaterialDidaticoStatus} status - Material status
 * @property {string} dataCadastro - Creation timestamp (ISO 8601)
 */
export interface MaterialDidaticoListResponse {
  id: number;
  titulo: string;
  editalId: number;
  disciplinaId: number;
  nivelDificuldade: MaterialDidaticoNivel;
  status: MaterialDidaticoStatus;
  dataCadastro: string;
}
