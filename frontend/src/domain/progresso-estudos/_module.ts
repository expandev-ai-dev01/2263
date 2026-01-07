/**
 * @module domain/progresso-estudos
 * @description Progresso de Estudos domain module exports
 */

export * from './components';
export * from './services';
export * from './hooks';
export * from './validations';

// Explicit type exports with renames to avoid collisions
export type {
  DashboardProgresso,
  EstatisticasTempo,
  GraficoEvolucao,
  RelatorioProgresso,
  PreferenciasNotificacao,
  ComparacaoPeriodos,
  FiltrosProgresso,
} from './types';

// Export form types from validations
export type {
  PreferenciasNotificacaoFormInput,
  PreferenciasNotificacaoFormOutput,
} from './validations/progresso-estudos';
