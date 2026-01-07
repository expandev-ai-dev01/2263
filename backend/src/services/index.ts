/**
 * @summary
 * Centralized service exports.
 * Provides single import point for all business logic services.
 *
 * @module services
 */

export {
  materialDidaticoCreate,
  materialDidaticoList,
  materialDidaticoGet,
  materialDidaticoUpdate,
  materialDidaticoDelete,
} from './materialDidatico';

export {
  metaDiariaCreate,
  metaDiariaList,
  metaDiariaGet,
  metaDiariaUpdate,
  metaDiariaDelete,
  metaDiariaDuplicate,
} from './metaDiaria';

export type {
  MaterialDidaticoEntity,
  MaterialDidaticoCreateRequest,
  MaterialDidaticoUpdateRequest,
  MaterialDidaticoListResponse,
} from './materialDidatico';

export type {
  MetaDiariaEntity,
  MetaDiariaCreateRequest,
  MetaDiariaUpdateRequest,
  MetaDiariaListResponse,
  HorarioPreferencial,
} from './metaDiaria';

export type {
  CreateInput as MaterialDidaticoCreateInput,
  UpdateInput as MaterialDidaticoUpdateInput,
  ParamsInput as MaterialDidaticoParamsInput,
} from './materialDidatico/materialDidaticoValidation';

export type {
  CreateInput as MetaDiariaCreateInput,
  UpdateInput as MetaDiariaUpdateInput,
  ParamsInput as MetaDiariaParamsInput,
  DuplicateInput as MetaDiariaDuplicateInput,
} from './metaDiaria/metaDiariaValidation';
