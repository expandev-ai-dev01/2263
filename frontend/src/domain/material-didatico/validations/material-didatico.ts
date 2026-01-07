/**
 * @module domain/material-didatico/validations
 * @description Zod validation schemas for Material Didático
 */

import { z } from 'zod';

const nivelDificuldadeOptions = ['basico', 'intermediario', 'avancado'] as const;
const statusOptions = ['ativo', 'inativo', 'processando'] as const;

export const materialDidaticoSchema = z.object({
  titulo: z
    .string('O título é obrigatório')
    .min(5, 'O título deve ter pelo menos 5 caracteres')
    .max(200, 'O título deve ter no máximo 200 caracteres')
    .refine((val) => val.trim().length > 0, 'O título não pode conter apenas espaços em branco'),
  editalId: z.number('Selecione um edital de concurso').int().positive(),
  disciplinaId: z.number('Selecione uma disciplina').int().positive(),
  descricao: z
    .string()
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres')
    .optional()
    .nullable(),
  arquivoPdf: z.string('O arquivo PDF é obrigatório').min(1, 'O arquivo PDF é obrigatório'),
  tags: z
    .array(
      z
        .string()
        .min(2, 'Cada tag deve ter pelo menos 2 caracteres')
        .max(30, 'Cada tag deve ter no máximo 30 caracteres')
    )
    .max(10, 'Máximo de 10 tags por material')
    .default([]),
  nivelDificuldade: z.enum(nivelDificuldadeOptions, 'Selecione o nível de dificuldade'),
  ordemApresentacao: z.number().int().positive().optional(),
  usuarioCadastro: z.number().int().positive(),
});

export const materialDidaticoUpdateSchema = z.object({
  titulo: z
    .string('O título é obrigatório')
    .min(5, 'O título deve ter pelo menos 5 caracteres')
    .max(200, 'O título deve ter no máximo 200 caracteres')
    .refine((val) => val.trim().length > 0, 'O título não pode conter apenas espaços em branco'),
  descricao: z
    .string()
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres')
    .optional()
    .nullable(),
  tags: z
    .array(
      z
        .string()
        .min(2, 'Cada tag deve ter pelo menos 2 caracteres')
        .max(30, 'Cada tag deve ter no máximo 30 caracteres')
    )
    .max(10, 'Máximo de 10 tags por material'),
  nivelDificuldade: z.enum(nivelDificuldadeOptions, 'Selecione o nível de dificuldade'),
  ordemApresentacao: z.number().int().positive(),
  status: z.enum(statusOptions, 'Selecione um status válido'),
});

export type MaterialDidaticoFormInput = z.input<typeof materialDidaticoSchema>;
export type MaterialDidaticoFormOutput = z.output<typeof materialDidaticoSchema>;
export type MaterialDidaticoUpdateFormInput = z.input<typeof materialDidaticoUpdateSchema>;
export type MaterialDidaticoUpdateFormOutput = z.output<typeof materialDidaticoUpdateSchema>;
