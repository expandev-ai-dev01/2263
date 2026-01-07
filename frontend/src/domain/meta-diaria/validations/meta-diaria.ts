/**
 * @module domain/meta-diaria/validations
 * @description Zod validation schemas for Meta Diária
 */

import { z } from 'zod';

const prioridadeOptions = ['alta', 'media', 'baixa'] as const;
const statusOptions = ['ativa', 'inativa', 'concluida'] as const;

const horarioPreferencialSchema = z
  .object({
    horarioInicio: z
      .string('Horário de início é obrigatório')
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de horário inválido (HH:MM)'),
    horarioFim: z
      .string('Horário de fim é obrigatório')
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de horário inválido (HH:MM)'),
  })
  .refine(
    (data) => {
      const [horaInicio, minInicio] = data.horarioInicio.split(':').map(Number);
      const [horaFim, minFim] = data.horarioFim.split(':').map(Number);
      const inicio = horaInicio * 60 + minInicio;
      const fim = horaFim * 60 + minFim;
      return fim > inicio;
    },
    {
      message: 'Horário de fim deve ser posterior ao horário de início',
      path: ['horarioFim'],
    }
  );

export const metaDiariaSchema = z.object({
  usuarioId: z.number().int().positive(),
  dataMeta: z
    .string('Data da meta é obrigatória')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (YYYY-MM-DD)')
    .refine((date) => {
      const metaDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return metaDate >= today;
    }, 'A data da meta não pode ser anterior ao dia atual'),
  tituloMeta: z
    .string('Título da meta é obrigatório')
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres')
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      'O título pode conter apenas letras, números, espaços, hífen e underscore'
    ),
  tempoTotalDesejado: z
    .number()
    .int()
    .min(15, 'Tempo mínimo de 15 minutos')
    .refine((val) => val % 15 === 0, 'O tempo deve ser múltiplo de 15 minutos')
    .optional()
    .nullable(),
  horariosPreferenciais: z
    .array(horarioPreferencialSchema)
    .max(20, 'Máximo de 20 faixas de horários preferenciais')
    .default([]),
  materiasSelecionadas: z
    .array(z.number().int().positive())
    .min(1, 'Selecione pelo menos uma matéria')
    .max(20, 'Máximo de 20 matérias por meta'),
  topicosEspecificos: z
    .array(
      z
        .string()
        .min(3, 'Cada tópico deve ter pelo menos 3 caracteres')
        .max(100, 'Cada tópico deve ter no máximo 100 caracteres')
    )
    .max(30, 'Máximo de 30 tópicos por meta')
    .default([]),
  prioridade: z.enum(prioridadeOptions, 'Selecione uma prioridade válida').default('media'),
});

export const metaDiariaUpdateSchema = z.object({
  tituloMeta: z
    .string('Título da meta é obrigatório')
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres')
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      'O título pode conter apenas letras, números, espaços, hífen e underscore'
    ),
  tempoTotalDesejado: z
    .number()
    .int()
    .min(15, 'Tempo mínimo de 15 minutos')
    .refine((val) => val % 15 === 0, 'O tempo deve ser múltiplo de 15 minutos')
    .optional()
    .nullable(),
  horariosPreferenciais: z
    .array(horarioPreferencialSchema)
    .max(20, 'Máximo de 20 faixas de horários preferenciais'),
  materiasSelecionadas: z
    .array(z.number().int().positive())
    .min(1, 'Selecione pelo menos uma matéria')
    .max(20, 'Máximo de 20 matérias por meta'),
  topicosEspecificos: z
    .array(
      z
        .string()
        .min(3, 'Cada tópico deve ter pelo menos 3 caracteres')
        .max(100, 'Cada tópico deve ter no máximo 100 caracteres')
    )
    .max(30, 'Máximo de 30 tópicos por meta'),
  prioridade: z.enum(prioridadeOptions, 'Selecione uma prioridade válida'),
  status: z.enum(statusOptions, 'Selecione um status válido'),
});

export const sessaoEstudoSchema = z
  .object({
    metaId: z.number().int().positive(),
    horarioInicio: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de horário inválido (HH:MM)')
      .optional()
      .nullable(),
    horarioFim: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de horário inválido (HH:MM)')
      .optional()
      .nullable(),
    duracaoMinutos: z
      .number('Duração é obrigatória')
      .int()
      .min(15, 'Duração mínima de 15 minutos')
      .refine((val) => val % 15 === 0, 'A duração deve ser múltiplo de 15 minutos'),
    materiaId: z.number('Selecione uma matéria').int().positive(),
    topico: z.string().max(200, 'Tópico deve ter no máximo 200 caracteres').optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.horarioInicio && !data.horarioFim) return false;
      if (!data.horarioInicio && data.horarioFim) return false;
      return true;
    },
    {
      message: 'Se informar horário de início, deve informar horário de fim',
      path: ['horarioFim'],
    }
  )
  .refine(
    (data) => {
      if (!data.horarioInicio || !data.horarioFim) return true;
      const [horaInicio, minInicio] = data.horarioInicio.split(':').map(Number);
      const [horaFim, minFim] = data.horarioFim.split(':').map(Number);
      const inicio = horaInicio * 60 + minInicio;
      const fim = horaFim * 60 + minFim;
      return fim > inicio;
    },
    {
      message: 'Horário de fim deve ser posterior ao horário de início',
      path: ['horarioFim'],
    }
  );

export type MetaDiariaFormInput = z.input<typeof metaDiariaSchema>;
export type MetaDiariaFormOutput = z.output<typeof metaDiariaSchema>;
export type MetaDiariaUpdateFormInput = z.input<typeof metaDiariaUpdateSchema>;
export type MetaDiariaUpdateFormOutput = z.output<typeof metaDiariaUpdateSchema>;
export type SessaoEstudoFormInput = z.input<typeof sessaoEstudoSchema>;
export type SessaoEstudoFormOutput = z.output<typeof sessaoEstudoSchema>;
