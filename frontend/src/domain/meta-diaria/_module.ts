/**
 * @module domain/meta-diaria
 * @description Meta Diária domain module exports
 */

export * from './components';
export * from './services';
export * from './hooks';
export * from './validations';

// Explicit type exports with renames to avoid collisions
export type {
  MetaDiaria,
  MetaDiariaListItem,
  MetaDiariaDetails,
  CreateMetaDiariaDto,
  UpdateMetaDiariaDto,
  DuplicateMetaDiariaDto,
  HorarioPreferencial,
} from './types';

// Export form types from validations
export type {
  MetaDiariaFormInput,
  MetaDiariaFormOutput,
  SessaoEstudoFormInput,
  SessaoEstudoFormOutput,
} from './validations/meta-diaria';
