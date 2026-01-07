/**
 * @summary
 * Business logic for MetaDiaria entity.
 * Handles CRUD operations using in-memory storage.
 * All validation and business logic is centralized here.
 *
 * @module services/metaDiaria/metaDiariaService
 */

import { META_DIARIA_DEFAULTS } from '@/constants';
import { metaDiariaStore } from '@/instances';
import { ServiceError } from '@/utils';
import { MetaDiariaEntity, MetaDiariaListResponse } from './metaDiariaTypes';
import { createSchema, updateSchema, paramsSchema, duplicateSchema } from './metaDiariaValidation';

/**
 * @summary
 * Lists all metas diárias from the in-memory store with optional filters.
 *
 * @function metaDiariaList
 * @module services/metaDiaria
 *
 * @param {unknown} query - Query parameters for filtering
 * @returns {Promise<MetaDiariaListResponse[]>} List of meta diária entities
 *
 * @example
 * const metas = await metaDiariaList({ usuarioId: 1, dataMeta: '2025-01-15' });
 */
export async function metaDiariaList(query: unknown): Promise<MetaDiariaListResponse[]> {
  const { usuarioId, dataMeta, status } = query as any;

  let records = metaDiariaStore.getAll();

  if (usuarioId) {
    records = records.filter((r) => r.usuarioId === Number(usuarioId));
  }

  if (dataMeta) {
    records = records.filter((r) => r.dataMeta === dataMeta);
  }

  if (status && status !== 'todas') {
    records = records.filter((r) => r.status === status);
  }

  return records.map((m) => ({
    id: m.id,
    dataMeta: m.dataMeta,
    tituloMeta: m.tituloMeta,
    prioridade: m.prioridade,
    status: m.status,
    totalSessoes: 0,
    dataCriacao: m.dataCriacao,
  }));
}

/**
 * @summary
 * Creates a new meta diária entity with validated data.
 *
 * @function metaDiariaCreate
 * @module services/metaDiaria
 *
 * @param {unknown} body - Raw request body to validate against createSchema
 * @returns {Promise<MetaDiariaEntity>} The newly created meta diária entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 *
 * @example
 * const newMeta = await metaDiariaCreate({
 *   usuarioId: 1,
 *   dataMeta: '2025-01-15',
 *   tituloMeta: 'Estudar Direito',
 *   tempoTotalDesejado: 120,
 *   horariosPreferenciais: [{ horarioInicio: '08:00', horarioFim: '10:00' }],
 *   materiasSelecionadas: [1, 2],
 *   topicosEspecificos: ['Constitucional', 'Administrativo'],
 *   prioridade: 'alta'
 * });
 */
export async function metaDiariaCreate(body: unknown): Promise<MetaDiariaEntity> {
  const validation = createSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const params = validation.data;
  const now = new Date().toISOString();
  const id = metaDiariaStore.getNextId();

  const newMeta: MetaDiariaEntity = {
    id,
    usuarioId: params.usuarioId,
    dataMeta: params.dataMeta,
    tituloMeta: params.tituloMeta,
    tempoTotalDesejado: params.tempoTotalDesejado,
    horariosPreferenciais: params.horariosPreferenciais,
    materiasSelecionadas: params.materiasSelecionadas,
    topicosEspecificos: params.topicosEspecificos,
    prioridade: params.prioridade,
    status: META_DIARIA_DEFAULTS.STATUS,
    dataCriacao: now,
  };

  metaDiariaStore.add(newMeta);
  return newMeta;
}

/**
 * @summary
 * Retrieves a specific meta diária by its unique identifier.
 *
 * @function metaDiariaGet
 * @module services/metaDiaria
 *
 * @param {unknown} params - Raw request params containing the ID to validate
 * @returns {Promise<MetaDiariaEntity>} The found meta diária entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID parameter is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When entity with given ID does not exist
 *
 * @example
 * const meta = await metaDiariaGet({ id: '1' });
 */
export async function metaDiariaGet(params: unknown): Promise<MetaDiariaEntity> {
  const validation = paramsSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, validation.error.errors);
  }

  const { id } = validation.data;
  const record = metaDiariaStore.getById(id);

  if (!record) {
    throw new ServiceError('NOT_FOUND', 'Meta diária não encontrada', 404);
  }

  return record as MetaDiariaEntity;
}

/**
 * @summary
 * Updates an existing meta diária entity with new data.
 *
 * @function metaDiariaUpdate
 * @module services/metaDiaria
 *
 * @param {unknown} params - Raw request params containing the ID to validate
 * @param {unknown} body - Raw request body with update data to validate
 * @returns {Promise<MetaDiariaEntity>} The updated meta diária entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID or body fails validation
 * @throws {ServiceError} NOT_FOUND (404) - When entity with given ID does not exist
 *
 * @example
 * const updated = await metaDiariaUpdate(
 *   { id: '1' },
 *   { tituloMeta: 'Título Atualizado', status: 'concluida' }
 * );
 */
export async function metaDiariaUpdate(params: unknown, body: unknown): Promise<MetaDiariaEntity> {
  const paramsValidation = paramsSchema.safeParse(params);

  if (!paramsValidation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, paramsValidation.error.errors);
  }

  const bodyValidation = updateSchema.safeParse(body);

  if (!bodyValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      bodyValidation.error.errors
    );
  }

  const { id } = paramsValidation.data;
  const existing = metaDiariaStore.getById(id);

  if (!existing) {
    throw new ServiceError('NOT_FOUND', 'Meta diária não encontrada', 404);
  }

  const updateData = bodyValidation.data;

  const updated = metaDiariaStore.update(id, {
    tituloMeta: updateData.tituloMeta,
    tempoTotalDesejado: updateData.tempoTotalDesejado,
    horariosPreferenciais: updateData.horariosPreferenciais,
    materiasSelecionadas: updateData.materiasSelecionadas,
    topicosEspecificos: updateData.topicosEspecificos,
    prioridade: updateData.prioridade,
    status: updateData.status,
  });

  return updated as MetaDiariaEntity;
}

/**
 * @summary
 * Permanently deletes a meta diária entity by its ID.
 *
 * @function metaDiariaDelete
 * @module services/metaDiaria
 *
 * @param {unknown} params - Raw request params containing the ID to validate
 * @returns {Promise<{ message: string }>} Success confirmation message
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID parameter is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When entity with given ID does not exist
 *
 * @example
 * const result = await metaDiariaDelete({ id: '1' });
 */
export async function metaDiariaDelete(params: unknown): Promise<{ message: string }> {
  const validation = paramsSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, validation.error.errors);
  }

  const { id } = validation.data;

  if (!metaDiariaStore.exists(id)) {
    throw new ServiceError('NOT_FOUND', 'Meta diária não encontrada', 404);
  }

  metaDiariaStore.delete(id);
  return { message: 'Meta diária excluída com sucesso' };
}

/**
 * @summary
 * Duplicates an existing meta diária to a new date.
 *
 * @function metaDiariaDuplicate
 * @module services/metaDiaria
 *
 * @param {unknown} params - Raw request params containing the ID to validate
 * @param {unknown} body - Raw request body with dataDestino
 * @returns {Promise<MetaDiariaEntity>} The newly created duplicated meta
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID or body fails validation
 * @throws {ServiceError} NOT_FOUND (404) - When entity with given ID does not exist
 *
 * @example
 * const duplicated = await metaDiariaDuplicate({ id: '1' }, { dataDestino: '2025-01-20' });
 */
export async function metaDiariaDuplicate(
  params: unknown,
  body: unknown
): Promise<MetaDiariaEntity> {
  const paramsValidation = paramsSchema.safeParse(params);

  if (!paramsValidation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, paramsValidation.error.errors);
  }

  const bodyValidation = duplicateSchema.safeParse(body);

  if (!bodyValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      bodyValidation.error.errors
    );
  }

  const { id } = paramsValidation.data;
  const { dataDestino } = bodyValidation.data;

  const existing = metaDiariaStore.getById(id);

  if (!existing) {
    throw new ServiceError('NOT_FOUND', 'Meta diária não encontrada', 404);
  }

  const now = new Date().toISOString();
  const newId = metaDiariaStore.getNextId();

  const duplicated: MetaDiariaEntity = {
    id: newId,
    usuarioId: existing.usuarioId,
    dataMeta: dataDestino,
    tituloMeta: existing.tituloMeta,
    tempoTotalDesejado: existing.tempoTotalDesejado,
    horariosPreferenciais: [...existing.horariosPreferenciais],
    materiasSelecionadas: [...existing.materiasSelecionadas],
    topicosEspecificos: [...existing.topicosEspecificos],
    prioridade: existing.prioridade,
    status: META_DIARIA_DEFAULTS.STATUS,
    dataCriacao: now,
  };

  metaDiariaStore.add(duplicated);
  return duplicated;
}
