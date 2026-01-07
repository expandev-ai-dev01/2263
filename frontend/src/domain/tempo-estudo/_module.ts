/**
 * @module domain/tempo-estudo
 * @description Tempo de Estudo domain module exports
 */

export * from './components';
export * from './services';
export * from './hooks';
export * from './validations';

// Explicit type exports with renames to avoid collisions
export type {
  SessaoEstudo,
  RegistroManual,
  HistoricoSessao,
  EstatisticasTempo,
  PausaSessao,
} from './types';

// Export form types from validations
export type {
  RegistroManualFormInput,
  RegistroManualFormOutput,
  SessaoAutomaticaEditFormInput,
  SessaoAutomaticaEditFormOutput,
} from './validations/tempo-estudo';
