/**
 * @summary
 * Validation schemas for MaterialDidatico entity.
 * Centralizes all Zod validation logic for the service.
 *
 * @module services/materialDidatico/materialDidaticoValidation
 */

import { z } from 'zod';
import {
  MATERIAL_DIDATICO_LIMITS,
  MATERIAL_DIDATICO_NIVEIS,
  MATERIAL_DIDATICO_STATUS,
} from '@/constants';

/**
 * Schema for tags array validation
 */
export const tagsSchema = z
  .array(
    z
      .string()
      .min(MATERIAL_DIDATICO_LIMITS.TAG_MIN_LENGTH)
      .max(MATERIAL_DIDATICO_LIMITS.TAG_MAX_LENGTH)
  )
  .max(10);

/**
 * Schema for create request validation
 */
export const createSchema = z.object({
  titulo: z
    .string()
    .min(MATERIAL_DIDATICO_LIMITS.TITULO_MIN_LENGTH)
    .max(MATERIAL_DIDATICO_LIMITS.TITULO_MAX_LENGTH),
  editalId: z.number().int().positive(),
  disciplinaId: z.number().int().positive(),
  descricao: z.string().max(MATERIAL_DIDATICO_LIMITS.DESCRICAO_MAX_LENGTH).nullable(),
  arquivoPdf: z.string().max(MATERIAL_DIDATICO_LIMITS.ARQUIVO_NOME_MAX_LENGTH),
  tags: tagsSchema,
  nivelDificuldade: z.enum([
    MATERIAL_DIDATICO_NIVEIS.BASICO,
    MATERIAL_DIDATICO_NIVEIS.INTERMEDIARIO,
    MATERIAL_DIDATICO_NIVEIS.AVANCADO,
  ]),
  ordemApresentacao: z.number().int().positive().optional(),
  usuarioCadastro: z.number().int().positive(),
});

/**
 * Schema for update request validation
 */
export const updateSchema = z.object({
  titulo: z
    .string()
    .min(MATERIAL_DIDATICO_LIMITS.TITULO_MIN_LENGTH)
    .max(MATERIAL_DIDATICO_LIMITS.TITULO_MAX_LENGTH),
  descricao: z.string().max(MATERIAL_DIDATICO_LIMITS.DESCRICAO_MAX_LENGTH).nullable(),
  tags: tagsSchema,
  nivelDificuldade: z.enum([
    MATERIAL_DIDATICO_NIVEIS.BASICO,
    MATERIAL_DIDATICO_NIVEIS.INTERMEDIARIO,
    MATERIAL_DIDATICO_NIVEIS.AVANCADO,
  ]),
  ordemApresentacao: z.number().int().positive(),
  status: z.enum([
    MATERIAL_DIDATICO_STATUS.ATIVO,
    MATERIAL_DIDATICO_STATUS.INATIVO,
    MATERIAL_DIDATICO_STATUS.PROCESSANDO,
  ]),
});

/**
 * Schema for ID parameter validation
 */
export const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * Inferred types from schemas
 */
export type CreateInput = z.infer<typeof createSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;
export type ParamsInput = z.infer<typeof paramsSchema>;
