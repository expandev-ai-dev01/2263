/**
 * @module domain/tempo-estudo/validations
 * @description Zod validation schemas for Tempo de Estudo
 */

import { z } from 'zod';

const motivoEdicaoOptions = [
  'interruption_correction',
  'time_adjustment',
  'subject_correction',
] as const;

export const registroManualSchema = z
  .object({
    usuarioId: z.number().int().positive(),
    materiaId: z.number('Selecione uma matéria').int().positive(),
    dataEstudo: z
      .string('Data do estudo é obrigatória')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (YYYY-MM-DD)')
      .refine((date) => {
        const estudoDate = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return estudoDate <= today;
      }, 'Não é possível registrar tempo de estudo para datas futuras')
      .refine((date) => {
        const estudoDate = new Date(date);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return estudoDate >= oneYearAgo;
      }, 'Não é possível registrar tempo para datas anteriores a 1 ano'),
    horarioInicio: z
      .string('Horário de início é obrigatório')
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário deve estar no formato HH:MM'),
    horarioFim: z
      .string('Horário de fim é obrigatório')
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário deve estar no formato HH:MM'),
    descricao: z
      .string()
      .max(500, 'Descrição deve ter no máximo 500 caracteres')
      .optional()
      .nullable(),
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
  )
  .refine(
    (data) => {
      const [horaInicio, minInicio] = data.horarioInicio.split(':').map(Number);
      const [horaFim, minFim] = data.horarioFim.split(':').map(Number);
      const inicio = horaInicio * 60 + minInicio;
      const fim = horaFim * 60 + minFim;
      const duracao = fim - inicio;
      return duracao >= 15 && duracao <= 720;
    },
    {
      message: 'A duração deve ser entre 15 minutos e 12 horas',
      path: ['horarioFim'],
    }
  );

export const sessaoAutomaticaEditSchema = z.object({
  sessaoId: z.number().int().positive(),
  motivoEdicao: z.enum(motivoEdicaoOptions, 'Selecione um motivo válido'),
  novaDataHoraFim: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, 'Formato de data/hora inválido (ISO 8601)')
    .optional(),
  novaMateriaId: z.number().int().positive().optional(),
});

export type RegistroManualFormInput = z.input<typeof registroManualSchema>;
export type RegistroManualFormOutput = z.output<typeof registroManualSchema>;
export type SessaoAutomaticaEditFormInput = z.input<typeof sessaoAutomaticaEditSchema>;
export type SessaoAutomaticaEditFormOutput = z.output<typeof sessaoAutomaticaEditSchema>;
