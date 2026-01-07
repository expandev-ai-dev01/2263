/**
 * @summary
 * Validation schemas for ProgressoEstudos entity.
 * Centralizes all Zod validation logic for the service.
 *
 * @module services/progressoEstudos/progressoEstudosValidation
 */

import { z } from 'zod';
import {
  PERIODO_REFERENCIA,
  TIPO_GRAFICO,
  PERIODO_GRAFICO,
  METRICA_EXIBIDA,
  TIPO_RELATORIO,
  FORMATO_EXPORTACAO,
  PERIODO_RELATORIO,
  TIPO_MARCO,
  CANAL_NOTIFICACAO,
  PERIODO_COMPARACAO,
} from '@/constants';

/**
 * Schema for dashboard request validation
 */
export const dashboardRequestSchema = z.object({
  usuarioId: z.number().int().positive(),
});

/**
 * Schema for time statistics request validation
 */
export const estatisticasTempoRequestSchema = z.object({
  usuarioId: z.number().int().positive(),
  periodoReferencia: z.enum([
    PERIODO_REFERENCIA.DIARIO,
    PERIODO_REFERENCIA.SEMANAL,
    PERIODO_REFERENCIA.MENSAL,
  ]),
});

/**
 * Schema for filters validation
 */
export const filtrosSchema = z
  .object({
    filtroMateria: z.string().optional(),
    filtroDisciplina: z.string().optional(),
    filtroCategoria: z.string().optional(),
  })
  .optional();

/**
 * Schema for chart request validation
 */
export const graficoEvolucaoRequestSchema = z.object({
  usuarioId: z.number().int().positive(),
  tipoGrafico: z.enum([TIPO_GRAFICO.LINHA, TIPO_GRAFICO.BARRA, TIPO_GRAFICO.AREA]),
  periodoGrafico: z.enum([
    PERIODO_GRAFICO.SETE_DIAS,
    PERIODO_GRAFICO.TRINTA_DIAS,
    PERIODO_GRAFICO.NOVENTA_DIAS,
    PERIODO_GRAFICO.UM_ANO,
  ]),
  metricaExibida: z.enum([
    METRICA_EXIBIDA.TEMPO_ESTUDO,
    METRICA_EXIBIDA.CONTEUDOS_CONCLUIDOS,
    METRICA_EXIBIDA.DESEMPENHO_QUESTOES,
    METRICA_EXIBIDA.PERCENTUAL_ACERTOS,
    METRICA_EXIBIDA.QUESTOES_RESOLVIDAS,
  ]),
  filtros: filtrosSchema,
});

/**
 * Schema for report request validation
 */
export const relatorioProgressoRequestSchema = z
  .object({
    usuarioId: z.number().int().positive(),
    tipoRelatorio: z.enum([
      TIPO_RELATORIO.COMPLETO,
      TIPO_RELATORIO.RESUMIDO,
      TIPO_RELATORIO.PERSONALIZADO,
    ]),
    formatoExportacao: z.enum([
      FORMATO_EXPORTACAO.PDF,
      FORMATO_EXPORTACAO.EXCEL,
      FORMATO_EXPORTACAO.ODS,
      FORMATO_EXPORTACAO.CSV,
    ]),
    periodoRelatorio: z.enum([
      PERIODO_RELATORIO.ULTIMA_SEMANA,
      PERIODO_RELATORIO.ULTIMO_MES,
      PERIODO_RELATORIO.ULTIMOS_3_MESES,
      PERIODO_RELATORIO.PERSONALIZADO,
    ]),
    dataInicioPersonalizada: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    dataFimPersonalizada: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    filtros: filtrosSchema,
  })
  .refine(
    (data) => {
      if (data.periodoRelatorio === PERIODO_RELATORIO.PERSONALIZADO) {
        return data.dataInicioPersonalizada && data.dataFimPersonalizada;
      }
      return true;
    },
    {
      message: 'Datas personalizadas são obrigatórias quando período é personalizado',
    }
  )
  .refine(
    (data) => {
      if (data.dataInicioPersonalizada && data.dataFimPersonalizada) {
        return new Date(data.dataInicioPersonalizada) < new Date(data.dataFimPersonalizada);
      }
      return true;
    },
    {
      message: 'Data início deve ser anterior à data fim',
    }
  );

/**
 * Schema for notification preferences validation
 */
export const preferenciasNotificacaoRequestSchema = z.object({
  usuarioId: z.number().int().positive(),
  notificacaoPushHabilitada: z.boolean(),
  notificacaoEmailHabilitada: z.boolean(),
  notificacaoSmsHabilitada: z.boolean(),
  tiposMarcoHabilitados: z.array(
    z.enum([TIPO_MARCO.META_ATINGIDA, TIPO_MARCO.STREAK_MILESTONE, TIPO_MARCO.PROGRESSO_PERCENTUAL])
  ),
});

/**
 * Schema for period comparison validation
 */
export const comparacaoPeriodosRequestSchema = z
  .object({
    usuarioId: z.number().int().positive(),
    periodoAtual: z.enum([
      PERIODO_COMPARACAO.ESTA_SEMANA,
      PERIODO_COMPARACAO.ESTE_MES,
      PERIODO_COMPARACAO.ESTE_TRIMESTRE,
    ]),
    periodoComparacao: z.enum([
      PERIODO_COMPARACAO.SEMANA_ANTERIOR,
      PERIODO_COMPARACAO.MES_ANTERIOR,
      PERIODO_COMPARACAO.TRIMESTRE_ANTERIOR,
    ]),
    metricaComparacao: z.enum([
      METRICA_EXIBIDA.TEMPO_ESTUDO,
      METRICA_EXIBIDA.CONTEUDOS_CONCLUIDOS,
      METRICA_EXIBIDA.DESEMPENHO_QUESTOES,
    ]),
    filtros: filtrosSchema,
  })
  .refine(
    (data) => {
      const periodMap: { [key: string]: string } = {
        [PERIODO_COMPARACAO.ESTA_SEMANA]: PERIODO_COMPARACAO.SEMANA_ANTERIOR,
        [PERIODO_COMPARACAO.ESTE_MES]: PERIODO_COMPARACAO.MES_ANTERIOR,
        [PERIODO_COMPARACAO.ESTE_TRIMESTRE]: PERIODO_COMPARACAO.TRIMESTRE_ANTERIOR,
      };
      return periodMap[data.periodoAtual] === data.periodoComparacao;
    },
    {
      message: 'Períodos selecionados são incompatíveis para comparação',
    }
  );

/**
 * Inferred types from schemas
 */
export type DashboardRequestInput = z.infer<typeof dashboardRequestSchema>;
export type EstatisticasTempoRequestInput = z.infer<typeof estatisticasTempoRequestSchema>;
export type GraficoEvolucaoRequestInput = z.infer<typeof graficoEvolucaoRequestSchema>;
export type RelatorioProgressoRequestInput = z.infer<typeof relatorioProgressoRequestSchema>;
export type PreferenciasNotificacaoRequestInput = z.infer<
  typeof preferenciasNotificacaoRequestSchema
>;
export type ComparacaoPeriodosRequestInput = z.infer<typeof comparacaoPeriodosRequestSchema>;
