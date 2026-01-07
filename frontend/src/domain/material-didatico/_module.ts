/**
 * @module domain/material-didatico
 * @description Material Didático domain module exports
 */

export * from './components';
export * from './services';
export * from './hooks';
export * from './validations';

// Explicit type exports with renames to avoid collisions
export type {
  MaterialDidatico,
  MaterialDidaticoListItem,
  MaterialDidaticoDetails,
  CreateMaterialDidaticoDto,
  UpdateMaterialDidaticoDto,
} from './types';

// Export form types from validations
export type {
  MaterialDidaticoFormInput,
  MaterialDidaticoFormOutput,
} from './validations/material-didatico';
