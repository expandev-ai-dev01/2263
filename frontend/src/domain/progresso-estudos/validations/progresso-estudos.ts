/**
 * @module domain/progresso-estudos/validations
 * @description Zod validation schemas for Progresso de Estudos
 */

import { z } from 'zod';

const tiposMarcoOptions = ['meta_atingida', 'streak_milestone', 'progresso_percentual'] as const;

export const preferenciasNotificacaoSchema = z.object({
  usuarioId: z.number().int().positive(),
  notificacaoPushHabilitada: z.boolean('Defina se deseja notificações push'),
  notificacaoEmailHabilitada: z.boolean('Defina se deseja notificações por email'),
  notificacaoSmsHabilitada: z.boolean('Defina se deseja notificações por SMS'),
  tiposMarcoHabilitados: z
    .array(z.enum(tiposMarcoOptions, 'Tipo de marco inválido'))
    .min(1, 'Selecione pelo menos um tipo de marco')
    .default(['meta_atingida', 'streak_milestone', 'progresso_percentual']),
});

export type PreferenciasNotificacaoFormInput = z.input<typeof preferenciasNotificacaoSchema>;
export type PreferenciasNotificacaoFormOutput = z.output<typeof preferenciasNotificacaoSchema>;
