/**
 * @summary
 * Validation schemas for MetaDiaria entity.
 * Centralizes all Zod validation logic for the service.
 *
 * @module services/metaDiaria/metaDiariaValidation
 */

import { z } from 'zod';
import {
  META_DIARIA_LIMITS,
  META_DIARIA_PRIORIDADES,
  META_DIARIA_STATUS,
  META_DIARIA_DEFAULTS,
} from '@/constants';

/**
 * Schema for time validation (HH:MM format)
 */
export const timeSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
  message: 'Horário deve estar no formato HH:MM',
});

/**
 * Schema for horario preferencial validation
 */
export const horarioPreferencialSchema = z
  .object({
    horarioInicio: timeSchema,
    horarioFim: timeSchema,
  })
  .refine(
    (data) => {
      const [startHour, startMin] = data.horarioInicio.split(':').map(Number);
      const [endHour, endMin] = data.horarioFim.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      return endMinutes > startMinutes;
    },
    {
      message: 'Horário fim deve ser posterior ao horário início',
    }
  );

/**
 * Schema for date validation (YYYY-MM-DD format, not in the past)
 */
export const dateMetaSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato YYYY-MM-DD',
  })
  .refine(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const metaDate = new Date(date);
      return metaDate >= today;
    },
    {
      message: 'A data da meta não pode ser anterior ao dia atual',
    }
  );

/**
 * Schema for tempo total validation (optional, multiple of 15, minimum 15)
 */
export const tempoTotalSchema = z
  .number()
  .int()
  .min(META_DIARIA_DEFAULTS.TEMPO_MINIMO_SESSAO, {
    message: `Tempo total deve ser no mínimo ${META_DIARIA_DEFAULTS.TEMPO_MINIMO_SESSAO} minutos`,
  })
  .refine((val) => val % META_DIARIA_DEFAULTS.MULTIPLO_TEMPO === 0, {
    message: `Tempo total deve ser múltiplo de ${META_DIARIA_DEFAULTS.MULTIPLO_TEMPO} minutos`,
  })
  .nullable();

/**
 * Schema for create request validation
 */
export const createSchema = z.object({
  usuarioId: z.number().int().positive(),
  dataMeta: dateMetaSchema,
  tituloMeta: z
    .string()
    .min(META_DIARIA_LIMITS.TITULO_MIN_LENGTH)
    .max(META_DIARIA_LIMITS.TITULO_MAX_LENGTH)
    .regex(/^[a-zA-Z0-9\s\-_]+$/, {
      message: 'Título não pode conter caracteres especiais exceto hífen e underscore',
    }),
  tempoTotalDesejado: tempoTotalSchema,
  horariosPreferenciais: z
    .array(horarioPreferencialSchema)
    .max(META_DIARIA_DEFAULTS.MAX_HORARIOS_PREFERENCIAIS),
  materiasSelecionadas: z
    .array(z.number().int().positive())
    .min(1, { message: 'Selecione pelo menos uma matéria para a meta' })
    .max(META_DIARIA_DEFAULTS.MAX_MATERIAS),
  topicosEspecificos: z
    .array(
      z.string().min(META_DIARIA_LIMITS.TOPICO_MIN_LENGTH).max(META_DIARIA_LIMITS.TOPICO_MAX_LENGTH)
    )
    .max(META_DIARIA_DEFAULTS.MAX_TOPICOS),
  prioridade: z.enum([
    META_DIARIA_PRIORIDADES.ALTA,
    META_DIARIA_PRIORIDADES.MEDIA,
    META_DIARIA_PRIORIDADES.BAIXA,
  ]),
});

/**
 * Schema for update request validation
 */
export const updateSchema = z.object({
  tituloMeta: z
    .string()
    .min(META_DIARIA_LIMITS.TITULO_MIN_LENGTH)
    .max(META_DIARIA_LIMITS.TITULO_MAX_LENGTH)
    .regex(/^[a-zA-Z0-9\s\-_]+$/, {
      message: 'Título não pode conter caracteres especiais exceto hífen e underscore',
    }),
  tempoTotalDesejado: tempoTotalSchema,
  horariosPreferenciais: z
    .array(horarioPreferencialSchema)
    .max(META_DIARIA_DEFAULTS.MAX_HORARIOS_PREFERENCIAIS),
  materiasSelecionadas: z
    .array(z.number().int().positive())
    .min(1, { message: 'Selecione pelo menos uma matéria para a meta' })
    .max(META_DIARIA_DEFAULTS.MAX_MATERIAS),
  topicosEspecificos: z
    .array(
      z.string().min(META_DIARIA_LIMITS.TOPICO_MIN_LENGTH).max(META_DIARIA_LIMITS.TOPICO_MAX_LENGTH)
    )
    .max(META_DIARIA_DEFAULTS.MAX_TOPICOS),
  prioridade: z.enum([
    META_DIARIA_PRIORIDADES.ALTA,
    META_DIARIA_PRIORIDADES.MEDIA,
    META_DIARIA_PRIORIDADES.BAIXA,
  ]),
  status: z.enum([
    META_DIARIA_STATUS.ATIVA,
    META_DIARIA_STATUS.INATIVA,
    META_DIARIA_STATUS.CONCLUIDA,
  ]),
});

/**
 * Schema for ID parameter validation
 */
export const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * Schema for duplicate request validation
 */
export const duplicateSchema = z.object({
  dataDestino: dateMetaSchema,
});

/**
 * Inferred types from schemas
 */
export type CreateInput = z.infer<typeof createSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;
export type ParamsInput = z.infer<typeof paramsSchema>;
export type DuplicateInput = z.infer<typeof duplicateSchema>;
