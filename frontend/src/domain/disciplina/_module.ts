/**
 * @module domain/disciplina
 * @description Disciplina domain module exports
 */

export * from './components';
export * from './services';
export * from './hooks';
export * from './validations';

// Explicit type exports with renames to avoid collisions
export type {
  Disciplina,
  DisciplinaListItem,
  DisciplinaDetails,
  CreateDisciplinaDto,
  UpdateDisciplinaDto,
  MoveDisciplinaDto,
} from './types';

// Export form types from validations
export type { DisciplinaFormInput, DisciplinaFormOutput } from './validations/disciplina';
