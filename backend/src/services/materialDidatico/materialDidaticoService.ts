/**
 * @summary
 * Business logic for MaterialDidatico entity.
 * Handles CRUD operations using in-memory storage.
 * All validation and business logic is centralized here.
 *
 * @module services/materialDidatico/materialDidaticoService
 */

import { MATERIAL_DIDATICO_DEFAULTS } from '@/constants';
import { materialDidaticoStore } from '@/instances';
import { ServiceError } from '@/utils';
import {
  MaterialDidaticoEntity,
  MaterialDidaticoListResponse,
  MaterialDidaticoCreateRequest,
  MaterialDidaticoUpdateRequest,
} from './materialDidaticoTypes';
import { createSchema, updateSchema, paramsSchema } from './materialDidaticoValidation';

/**
 * @summary
 * Lists all materiais didáticos from the in-memory store.
 *
 * @function materialDidaticoList
 * @module services/materialDidatico
 *
 * @returns {Promise<MaterialDidaticoListResponse[]>} List of material didático entities
 *
 * @example
 * const materiais = await materialDidaticoList();
 * // Returns: [{ id: 1, titulo: 'Material 1', editalId: 1, disciplinaId: 1, ... }]
 */
export async function materialDidaticoList(): Promise<MaterialDidaticoListResponse[]> {
  const records = materialDidaticoStore.getAll();
  return records.map((m) => ({
    id: m.id,
    titulo: m.titulo,
    editalId: m.editalId,
    disciplinaId: m.disciplinaId,
    nivelDificuldade: m.nivelDificuldade,
    status: m.status,
    dataCadastro: m.dataCadastro,
  }));
}

/**
 * @summary
 * Creates a new material didático entity with validated data.
 *
 * @function materialDidaticoCreate
 * @module services/materialDidatico
 *
 * @param {unknown} body - Raw request body to validate against createSchema
 * @returns {Promise<MaterialDidaticoEntity>} The newly created material didático entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 * @throws {ServiceError} DUPLICATE_TITULO (400) - When titulo already exists for edital + disciplina
 *
 * @example
 * const newMaterial = await materialDidaticoCreate({
 *   titulo: 'Direito Constitucional',
 *   editalId: 1,
 *   disciplinaId: 1,
 *   descricao: 'Material completo',
 *   arquivoPdf: '/path/to/file.pdf',
 *   tags: ['direito', 'constitucional'],
 *   nivelDificuldade: 'basico',
 *   usuarioCadastro: 1
 * });
 */
export async function materialDidaticoCreate(body: unknown): Promise<MaterialDidaticoEntity> {
  const validation = createSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const params = validation.data;

  /**
   * @rule {BR-007}
   * Check for duplicate titulo + edital + disciplina combination
   */
  if (
    materialDidaticoStore.existsTituloForEditalDisciplina(
      params.titulo,
      params.editalId,
      params.disciplinaId
    )
  ) {
    throw new ServiceError(
      'DUPLICATE_TITULO',
      'Já existe material com este título para o edital e disciplina selecionados',
      400
    );
  }

  const now = new Date().toISOString();
  const id = materialDidaticoStore.getNextId();

  /**
   * @rule {BR-009}
   * Calculate ordem_apresentacao automatically if not provided
   */
  const ordemApresentacao =
    params.ordemApresentacao ??
    materialDidaticoStore.getMaxOrdemApresentacao(params.disciplinaId) + 1;

  const newMaterial: MaterialDidaticoEntity = {
    id,
    titulo: params.titulo,
    editalId: params.editalId,
    disciplinaId: params.disciplinaId,
    descricao: params.descricao,
    arquivoPdf: params.arquivoPdf,
    tags: params.tags,
    nivelDificuldade: params.nivelDificuldade,
    ordemApresentacao,
    status: MATERIAL_DIDATICO_DEFAULTS.STATUS,
    dataCadastro: now,
    usuarioCadastro: params.usuarioCadastro,
  };

  materialDidaticoStore.add(newMaterial);
  return newMaterial;
}

/**
 * @summary
 * Retrieves a specific material didático by its unique identifier.
 *
 * @function materialDidaticoGet
 * @module services/materialDidatico
 *
 * @param {unknown} params - Raw request params containing the ID to validate
 * @returns {Promise<MaterialDidaticoEntity>} The found material didático entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID parameter is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When entity with given ID does not exist
 *
 * @example
 * const material = await materialDidaticoGet({ id: '1' });
 * // Returns: { id: 1, titulo: 'Material 1', ... }
 */
export async function materialDidaticoGet(params: unknown): Promise<MaterialDidaticoEntity> {
  const validation = paramsSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, validation.error.errors);
  }

  const { id } = validation.data;
  const record = materialDidaticoStore.getById(id);

  if (!record) {
    throw new ServiceError('NOT_FOUND', 'Material didático não encontrado', 404);
  }

  return record as MaterialDidaticoEntity;
}

/**
 * @summary
 * Updates an existing material didático entity with new data.
 *
 * @function materialDidaticoUpdate
 * @module services/materialDidatico
 *
 * @param {unknown} params - Raw request params containing the ID to validate
 * @param {unknown} body - Raw request body with update data to validate
 * @returns {Promise<MaterialDidaticoEntity>} The updated material didático entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID or body fails validation
 * @throws {ServiceError} NOT_FOUND (404) - When entity with given ID does not exist
 * @throws {ServiceError} DUPLICATE_TITULO (400) - When titulo already exists for edital + disciplina
 *
 * @example
 * const updated = await materialDidaticoUpdate(
 *   { id: '1' },
 *   { titulo: 'Título Atualizado', status: 'inativo' }
 * );
 */
export async function materialDidaticoUpdate(
  params: unknown,
  body: unknown
): Promise<MaterialDidaticoEntity> {
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
  const existing = materialDidaticoStore.getById(id);

  if (!existing) {
    throw new ServiceError('NOT_FOUND', 'Material didático não encontrado', 404);
  }

  const updateData = bodyValidation.data;

  /**
   * @rule {BR-007}
   * Check for duplicate titulo when updating (excluding current record)
   */
  if (
    materialDidaticoStore.existsTituloForEditalDisciplina(
      updateData.titulo,
      existing.editalId,
      existing.disciplinaId,
      id
    )
  ) {
    throw new ServiceError(
      'DUPLICATE_TITULO',
      'Já existe material com este título para o edital e disciplina selecionados',
      400
    );
  }

  const updated = materialDidaticoStore.update(id, {
    titulo: updateData.titulo,
    descricao: updateData.descricao,
    tags: updateData.tags,
    nivelDificuldade: updateData.nivelDificuldade,
    ordemApresentacao: updateData.ordemApresentacao,
    status: updateData.status,
  });

  return updated as MaterialDidaticoEntity;
}

/**
 * @summary
 * Permanently deletes a material didático entity by its ID.
 *
 * @function materialDidaticoDelete
 * @module services/materialDidatico
 *
 * @param {unknown} params - Raw request params containing the ID to validate
 * @returns {Promise<{ message: string }>} Success confirmation message
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID parameter is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When entity with given ID does not exist
 *
 * @example
 * const result = await materialDidaticoDelete({ id: '1' });
 * // Returns: { message: 'Material didático excluído com sucesso' }
 */
export async function materialDidaticoDelete(params: unknown): Promise<{ message: string }> {
  const validation = paramsSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, validation.error.errors);
  }

  const { id } = validation.data;

  if (!materialDidaticoStore.exists(id)) {
    throw new ServiceError('NOT_FOUND', 'Material didático não encontrado', 404);
  }

  materialDidaticoStore.delete(id);
  return { message: 'Material didático excluído com sucesso' };
}
