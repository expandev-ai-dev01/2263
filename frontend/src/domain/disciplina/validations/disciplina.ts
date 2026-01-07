/**
 * @module domain/disciplina/validations
 * @description Zod validation schemas for Disciplina
 */

import { z } from 'zod';

export const disciplinaSchema = z.object({
  nomeDisciplina: z
    .string('O nome da disciplina é obrigatório')
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-Z0-9\s\-]+$/, 'O nome pode conter apenas letras, números, espaços e hífen'),
  descricao: z
    .string()
    .max(500, 'A descrição deve ter no máximo 500 caracteres')
    .optional()
    .nullable(),
  disciplinaPaiId: z.string().uuid('ID da disciplina pai inválido').optional().nullable(),
  ordemExibicao: z
    .number('A ordem de exibição é obrigatória')
    .int()
    .positive('A ordem deve ser um número positivo')
    .default(1),
  ativa: z.boolean('Defina se a disciplina está ativa').default(true),
});

export const disciplinaUpdateSchema = z.object({
  nomeDisciplina: z
    .string('O nome da disciplina é obrigatório')
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-Z0-9\s\-]+$/, 'O nome pode conter apenas letras, números, espaços e hífen'),
  descricao: z
    .string()
    .max(500, 'A descrição deve ter no máximo 500 caracteres')
    .optional()
    .nullable(),
  ordemExibicao: z
    .number('A ordem de exibição é obrigatória')
    .int()
    .positive('A ordem deve ser um número positivo'),
  ativa: z.boolean('Defina se a disciplina está ativa'),
});

export const disciplinaDeleteSchema = z.object({
  confirmacaoExclusao: z.boolean().refine((val) => val === true, 'Você deve confirmar a exclusão'),
  motivoExclusao: z
    .string()
    .max(200, 'O motivo deve ter no máximo 200 caracteres')
    .optional()
    .nullable(),
});

export type DisciplinaFormInput = z.input<typeof disciplinaSchema>;
export type DisciplinaFormOutput = z.output<typeof disciplinaSchema>;
export type DisciplinaUpdateFormInput = z.input<typeof disciplinaUpdateSchema>;
export type DisciplinaUpdateFormOutput = z.output<typeof disciplinaUpdateSchema>;
export type DisciplinaDeleteFormInput = z.input<typeof disciplinaDeleteSchema>;
export type DisciplinaDeleteFormOutput = z.output<typeof disciplinaDeleteSchema>;
