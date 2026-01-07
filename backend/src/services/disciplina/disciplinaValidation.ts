/**
 * @summary
 * Validation schemas for Disciplina entity.
 * Centralizes all Zod validation logic for the service.
 *
 * @module services/disciplina/disciplinaValidation
 */

import { z } from 'zod';
import { DISCIPLINA_LIMITS } from '@/constants';

/**
 * Schema for create request validation
 */
export const createSchema = z.object({
  nomeDisciplina: z
    .string()
    .min(DISCIPLINA_LIMITS.NOME_MIN_LENGTH)
    .max(DISCIPLINA_LIMITS.NOME_MAX_LENGTH)
    .regex(/^[a-zA-Z0-9\s\-]+$/, {
      message: 'Nome não pode conter caracteres especiais exceto hífen e espaço',
    }),
  descricao: z.string().max(DISCIPLINA_LIMITS.DESCRICAO_MAX_LENGTH).nullable(),
  disciplinaPaiId: z.string().nullable(),
  ordemExibicao: z.number().int().positive(),
  ativa: z.boolean(),
});

/**
 * Schema for update request validation
 */
export const updateSchema = z.object({
  nomeDisciplina: z
    .string()
    .min(DISCIPLINA_LIMITS.NOME_MIN_LENGTH)
    .max(DISCIPLINA_LIMITS.NOME_MAX_LENGTH)
    .regex(/^[a-zA-Z0-9\s\-]+$/, {
      message: 'Nome não pode conter caracteres especiais exceto hífen e espaço',
    }),
  descricao: z.string().max(DISCIPLINA_LIMITS.DESCRICAO_MAX_LENGTH).nullable(),
  ordemExibicao: z.number().int().positive(),
  ativa: z.boolean(),
});

/**
 * Schema for ID parameter validation
 */
export const paramsSchema = z.object({
  id: z.string().min(1),
});

/**
 * Schema for delete request validation
 */
export const deleteSchema = z.object({
  confirmacaoExclusao: z.boolean().refine((val) => val === true, {
    message: 'Confirmação de exclusão é obrigatória',
  }),
  motivoExclusao: z.string().max(200).nullable(),
});

/**
 * Schema for hierarchy move request validation
 */
export const hierarchyMoveSchema = z.object({
  novoPaiId: z.string().nullable(),
  novaPosicao: z.number().int().positive(),
});

/**
 * Inferred types from schemas
 */
export type CreateInput = z.infer<typeof createSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;
export type ParamsInput = z.infer<typeof paramsSchema>;
export type DeleteInput = z.infer<typeof deleteSchema>;
export type HierarchyMoveInput = z.infer<typeof hierarchyMoveSchema>;
