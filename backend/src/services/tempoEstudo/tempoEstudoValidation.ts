/**
 * @summary
 * Validation schemas for TempoEstudo entity.
 * Centralizes all Zod validation logic for the service.
 *
 * @module services/tempoEstudo/tempoEstudoValidation
 */

import { z } from 'zod';
import {
  TEMPO_ESTUDO_DEFAULTS,
  STATUS_SESSAO,
  MOTIVO_INTERRUPCAO,
  MOTIVO_EDICAO,
} from '@/constants';

/**
 * Schema for time validation (HH:MM format)
 */
export const timeSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
  message: 'Horário deve estar no formato HH:MM',
});

/**
 * Schema for date validation (YYYY-MM-DD format)
 */
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: 'Data deve estar no formato YYYY-MM-DD',
});

/**
 * Schema for iniciar sessao request
 */
export const iniciarSessaoSchema = z.object({
  usuarioId: z.number().int().positive(),
  materiaId: z.number().int().positive(),
});

/**
 * Schema for finalizar sessao request
 */
export const finalizarSessaoSchema = z.object({
  sessaoId: z.number().int().positive(),
});

/**
 * Schema for pausar sessao request
 */
export const pausarSessaoSchema = z.object({
  sessaoId: z.number().int().positive(),
});

/**
 * Schema for retomar sessao request
 */
export const retomarSessaoSchema = z.object({
  sessaoId: z.number().int().positive(),
});

/**
 * Schema for criar registro manual request
 */
export const criarRegistroManualSchema = z
  .object({
    usuarioId: z.number().int().positive(),
    materiaId: z.number().int().positive(),
    dataEstudo: dateSchema.refine(
      (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const estudoDate = new Date(date);
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return estudoDate <= today && estudoDate >= oneYearAgo;
      },
      {
        message: 'Data não pode ser futura nem anterior a 1 ano',
      }
    ),
    horarioInicio: timeSchema,
    horarioFim: timeSchema,
    descricao: z.string().max(500).nullable(),
  })
  .refine(
    (data) => {
      const [startHour, startMin] = data.horarioInicio.split(':').map(Number);
      const [endHour, endMin] = data.horarioFim.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      const duration = endMinutes - startMinutes;
      return (
        duration >= TEMPO_ESTUDO_DEFAULTS.TEMPO_MINIMO_REGISTRO_MANUAL &&
        duration <= TEMPO_ESTUDO_DEFAULTS.TEMPO_MAXIMO_SESSAO
      );
    },
    {
      message: `Duração deve ser entre ${TEMPO_ESTUDO_DEFAULTS.TEMPO_MINIMO_REGISTRO_MANUAL} minutos e ${TEMPO_ESTUDO_DEFAULTS.TEMPO_MAXIMO_SESSAO} minutos`,
    }
  );

/**
 * Schema for atualizar registro manual request
 */
export const atualizarRegistroManualSchema = z
  .object({
    materiaId: z.number().int().positive(),
    dataEstudo: dateSchema.refine(
      (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const estudoDate = new Date(date);
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return estudoDate <= today && estudoDate >= oneYearAgo;
      },
      {
        message: 'Data não pode ser futura nem anterior a 1 ano',
      }
    ),
    horarioInicio: timeSchema,
    horarioFim: timeSchema,
    descricao: z.string().max(500).nullable(),
  })
  .refine(
    (data) => {
      const [startHour, startMin] = data.horarioInicio.split(':').map(Number);
      const [endHour, endMin] = data.horarioFim.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      const duration = endMinutes - startMinutes;
      return (
        duration >= TEMPO_ESTUDO_DEFAULTS.TEMPO_MINIMO_REGISTRO_MANUAL &&
        duration <= TEMPO_ESTUDO_DEFAULTS.TEMPO_MAXIMO_SESSAO
      );
    },
    {
      message: `Duração deve ser entre ${TEMPO_ESTUDO_DEFAULTS.TEMPO_MINIMO_REGISTRO_MANUAL} minutos e ${TEMPO_ESTUDO_DEFAULTS.TEMPO_MAXIMO_SESSAO} minutos`,
    }
  );

/**
 * Schema for editar sessao automatica request
 */
export const editarSessaoAutomaticaSchema = z.object({
  sessaoId: z.number().int().positive(),
  motivoEdicao: z.enum([
    MOTIVO_EDICAO.INTERRUPTION_CORRECTION,
    MOTIVO_EDICAO.TIME_ADJUSTMENT,
    MOTIVO_EDICAO.SUBJECT_CORRECTION,
  ]),
  novaDataHoraFim: z.string().datetime().optional(),
  novaMateriaId: z.number().int().positive().optional(),
});

/**
 * Schema for historico sessoes request
 */
export const historicoSessoesSchema = z.object({
  usuarioId: z.number().int().positive(),
  materiaId: z.number().int().positive().optional(),
  dataInicio: dateSchema.optional(),
  dataFim: dateSchema.optional(),
});

/**
 * Schema for estatisticas tempo request
 */
export const estatisticasTempoSchema = z
  .object({
    usuarioId: z.number().int().positive(),
    dataInicio: dateSchema,
    dataFim: dateSchema,
    materiaId: z.number().int().positive().optional(),
  })
  .refine(
    (data) => {
      return new Date(data.dataInicio) < new Date(data.dataFim);
    },
    {
      message: 'Data início deve ser anterior à data fim',
    }
  )
  .refine(
    (data) => {
      const diff = Math.abs(new Date(data.dataFim).getTime() - new Date(data.dataInicio).getTime());
      const days = diff / (1000 * 60 * 60 * 24);
      return days <= 730; // 2 years
    },
    {
      message: 'Período máximo de consulta é de 2 anos',
    }
  );

/**
 * Schema for ID parameter validation
 */
export const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * Inferred types from schemas
 */
export type IniciarSessaoInput = z.infer<typeof iniciarSessaoSchema>;
export type FinalizarSessaoInput = z.infer<typeof finalizarSessaoSchema>;
export type PausarSessaoInput = z.infer<typeof pausarSessaoSchema>;
export type RetomarSessaoInput = z.infer<typeof retomarSessaoSchema>;
export type CriarRegistroManualInput = z.infer<typeof criarRegistroManualSchema>;
export type AtualizarRegistroManualInput = z.infer<typeof atualizarRegistroManualSchema>;
export type EditarSessaoAutomaticaInput = z.infer<typeof editarSessaoAutomaticaSchema>;
export type HistoricoSessoesInput = z.infer<typeof historicoSessoesSchema>;
export type EstatisticasTempoInput = z.infer<typeof estatisticasTempoSchema>;
export type ParamsInput = z.infer<typeof paramsSchema>;
