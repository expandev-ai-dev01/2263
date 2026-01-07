/**
 * @module domain/progresso-estudos/types
 * @description Type definitions for Progresso de Estudos domain
 */

export interface DashboardProgresso {
  progressoGeralPercentual: number;
  conteudosConcluidos: number;
  conteudosTotais: number;
  streakDiasConsecutivos: number;
  conteudosAdicionadosRecentemente: number;
}

export interface EstatisticasTempo {
  tempoEstudoDiario: number;
  tempoEstudoSemanal: number;
  tempoEstudoMensal: number;
  periodoReferencia: 'diario' | 'semanal' | 'mensal';
}

export interface GraficoEvolucao {
  tipoGrafico: 'linha' | 'barra' | 'area';
  periodoGrafico: '7dias' | '30dias' | '90dias' | '1ano';
  metricaExibida:
    | 'tempo_estudo'
    | 'conteudos_concluidos'
    | 'desempenho_questoes'
    | 'percentual_acertos'
    | 'questoes_resolvidas';
  dados: Array<{
    data: string;
    valor: number;
  }>;
}

export interface RelatorioProgresso {
  tipoRelatorio: 'completo' | 'resumido' | 'personalizado';
  formatoExportacao: 'pdf' | 'excel' | 'ods' | 'csv';
  periodoRelatorio: 'ultima_semana' | 'ultimo_mes' | 'ultimos_3_meses' | 'personalizado';
  dataInicioPersonalizada?: string;
  dataFimPersonalizada?: string;
}

export interface PreferenciasNotificacao {
  notificacaoPushHabilitada: boolean;
  notificacaoEmailHabilitada: boolean;
  notificacaoSmsHabilitada: boolean;
  tiposMarcoHabilitados: Array<'meta_atingida' | 'streak_milestone' | 'progresso_percentual'>;
}

export interface ComparacaoPeriodos {
  periodoAtual: 'esta_semana' | 'este_mes' | 'este_trimestre';
  periodoComparacao: 'semana_anterior' | 'mes_anterior' | 'trimestre_anterior';
  variacaoPercentual: number;
  metricaComparacao: 'tempo_estudo' | 'conteudos_concluidos' | 'desempenho_questoes';
}

export interface FiltrosProgresso {
  filtroMateria?: string;
  filtroDisciplina?: string;
  filtroCategoria?: string;
}

export interface DashboardProgressoRequest {
  usuarioId: number;
}

export interface EstatisticasTempoRequest {
  usuarioId: number;
  periodoReferencia: 'diario' | 'semanal' | 'mensal';
}

export interface GraficoEvolucaoRequest {
  usuarioId: number;
  tipoGrafico: 'linha' | 'barra' | 'area';
  periodoGrafico: '7dias' | '30dias' | '90dias' | '1ano';
  metricaExibida:
    | 'tempo_estudo'
    | 'conteudos_concluidos'
    | 'desempenho_questoes'
    | 'percentual_acertos'
    | 'questoes_resolvidas';
  filtros?: FiltrosProgresso;
}

export interface RelatorioProgressoRequest {
  usuarioId: number;
  tipoRelatorio: 'completo' | 'resumido' | 'personalizado';
  formatoExportacao: 'pdf' | 'excel' | 'ods' | 'csv';
  periodoRelatorio: 'ultima_semana' | 'ultimo_mes' | 'ultimos_3_meses' | 'personalizado';
  dataInicioPersonalizada?: string;
  dataFimPersonalizada?: string;
  filtros?: FiltrosProgresso;
}

export interface PreferenciasNotificacaoRequest {
  usuarioId: number;
  notificacaoPushHabilitada: boolean;
  notificacaoEmailHabilitada: boolean;
  notificacaoSmsHabilitada: boolean;
  tiposMarcoHabilitados: Array<'meta_atingida' | 'streak_milestone' | 'progresso_percentual'>;
}

export interface ComparacaoPeriodosRequest {
  usuarioId: number;
  periodoAtual: 'esta_semana' | 'este_mes' | 'este_trimestre';
  periodoComparacao: 'semana_anterior' | 'mes_anterior' | 'trimestre_anterior';
  metricaComparacao: 'tempo_estudo' | 'conteudos_concluidos' | 'desempenho_questoes';
  filtros?: FiltrosProgresso;
}
