/**
 * @summary
 * Business logic for Disciplina entity.
 * Handles CRUD operations and hierarchy management using in-memory storage.
 * All validation and business logic is centralized here.
 *
 * @module services/disciplina/disciplinaService
 */

import { DISCIPLINA_DEFAULTS } from '@/constants';
import { disciplinaStore } from '@/instances';
import { ServiceError } from '@/utils';
import {
  DisciplinaEntity,
  DisciplinaListResponse,
  DisciplinaDeleteRequest,
  DisciplinaHierarchyMoveRequest,
} from './disciplinaTypes';
import {
  createSchema,
  updateSchema,
  paramsSchema,
  deleteSchema,
  hierarchyMoveSchema,
} from './disciplinaValidation';

/**
 * @summary
 * Lists all disciplinas from the in-memory store.
 *
 * @function disciplinaList
 * @module services/disciplina
 *
 * @returns {Promise<DisciplinaListResponse[]>} List of disciplina entities
 *
 * @example
 * const disciplinas = await disciplinaList();
 */
export async function disciplinaList(): Promise<DisciplinaListResponse[]> {
  const records = disciplinaStore.getAll();
  return records.map((d) => ({
    id: d.id,
    nomeDisciplina: d.nomeDisciplina,
    disciplinaPaiId: d.disciplinaPaiId,
    ordemExibicao: d.ordemExibicao,
    ativa: d.ativa,
    possuiSubdisciplinas: d.possuiSubdisciplinas,
    dataCriacao: d.dataCriacao,
  }));
}

/**
 * @summary
 * Creates a new disciplina entity with validated data.
 *
 * @function disciplinaCreate
 * @module services/disciplina
 *
 * @param {unknown} body - Raw request body to validate against createSchema
 * @returns {Promise<DisciplinaEntity>} The newly created disciplina entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 * @throws {ServiceError} DUPLICATE_NAME (400) - When name exists at same hierarchy level
 * @throws {ServiceError} MAX_HIERARCHY_EXCEEDED (400) - When hierarchy exceeds 3 levels
 * @throws {ServiceError} PARENT_NOT_FOUND (404) - When parent disciplina does not exist
 * @throws {ServiceError} CIRCULAR_REFERENCE (400) - When parent would create circular reference
 */
export async function disciplinaCreate(body: unknown): Promise<DisciplinaEntity> {
  const validation = createSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const params = validation.data;

  /**
   * @rule {BR-002}
   * Check for duplicate name at same hierarchy level
   */
  if (disciplinaStore.existsNameAtLevel(params.nomeDisciplina, params.disciplinaPaiId)) {
    throw new ServiceError(
      'DUPLICATE_NAME',
      'Já existe uma disciplina com este nome no mesmo nível hierárquico',
      400
    );
  }

  /**
   * @rule {BR-003}
   * Check hierarchy depth limit
   */
  if (params.disciplinaPaiId) {
    const parent = disciplinaStore.getById(params.disciplinaPaiId);
    if (!parent) {
      throw new ServiceError('PARENT_NOT_FOUND', 'Disciplina pai não encontrada', 404);
    }

    const parentDepth = disciplinaStore.getHierarchyDepth(params.disciplinaPaiId);
    if (parentDepth >= DISCIPLINA_DEFAULTS.MAX_HIERARCHY_LEVELS) {
      throw new ServiceError(
        'MAX_HIERARCHY_EXCEEDED',
        'Não é possível criar mais de 3 níveis de hierarquia',
        400
      );
    }
  }

  const now = new Date().toISOString();
  const id = disciplinaStore.getNextId();

  const newDisciplina: DisciplinaEntity = {
    id,
    nomeDisciplina: params.nomeDisciplina,
    descricao: params.descricao,
    disciplinaPaiId: params.disciplinaPaiId,
    ordemExibicao: params.ordemExibicao,
    ativa: params.ativa,
    possuiSubdisciplinas: false,
    dataCriacao: now,
    dataAtualizacao: now,
  };

  disciplinaStore.add(newDisciplina);

  /**
   * @rule {BR-001}
   * Update parent's possuiSubdisciplinas flag
   */
  if (params.disciplinaPaiId && params.ativa) {
    disciplinaStore.update(params.disciplinaPaiId, {
      possuiSubdisciplinas: true,
    });
  }

  return newDisciplina;
}

/**
 * @summary
 * Retrieves a specific disciplina by its unique identifier.
 *
 * @function disciplinaGet
 * @module services/disciplina
 *
 * @param {unknown} params - Raw request params containing the ID to validate
 * @returns {Promise<DisciplinaEntity>} The found disciplina entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID parameter is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When entity with given ID does not exist
 */
export async function disciplinaGet(params: unknown): Promise<DisciplinaEntity> {
  const validation = paramsSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, validation.error.errors);
  }

  const { id } = validation.data;
  const record = disciplinaStore.getById(id);

  if (!record) {
    throw new ServiceError('NOT_FOUND', 'Disciplina não encontrada', 404);
  }

  return record as DisciplinaEntity;
}

/**
 * @summary
 * Updates an existing disciplina entity with new data.
 *
 * @function disciplinaUpdate
 * @module services/disciplina
 *
 * @param {unknown} params - Raw request params containing the ID to validate
 * @param {unknown} body - Raw request body with update data to validate
 * @returns {Promise<DisciplinaEntity>} The updated disciplina entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID or body fails validation
 * @throws {ServiceError} NOT_FOUND (404) - When entity with given ID does not exist
 * @throws {ServiceError} DUPLICATE_NAME (400) - When name exists at same hierarchy level
 * @throws {ServiceError} CANNOT_DEACTIVATE (400) - When disciplina has associated content
 */
export async function disciplinaUpdate(params: unknown, body: unknown): Promise<DisciplinaEntity> {
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
  const existing = disciplinaStore.getById(id);

  if (!existing) {
    throw new ServiceError('NOT_FOUND', 'Disciplina não encontrada', 404);
  }

  const updateData = bodyValidation.data;

  /**
   * @rule {BR-002}
   * Check for duplicate name when updating (excluding current record)
   */
  if (disciplinaStore.existsNameAtLevel(updateData.nomeDisciplina, existing.disciplinaPaiId, id)) {
    throw new ServiceError(
      'DUPLICATE_NAME',
      'Já existe uma disciplina com este nome no mesmo nível hierárquico',
      400
    );
  }

  /**
   * @rule {BR-014}
   * Check if can deactivate (simplified - would check for associated content in real implementation)
   */
  if (!updateData.ativa && existing.ativa) {
    // In real implementation, check for associated content
    // For now, just check for subdisciplinas
    if (disciplinaStore.hasActiveSubdisciplinas(id)) {
      throw new ServiceError(
        'CANNOT_DEACTIVATE',
        'Não é possível inativar disciplina com subdisciplinas ativas',
        400
      );
    }
  }

  const updated = disciplinaStore.update(id, {
    nomeDisciplina: updateData.nomeDisciplina,
    descricao: updateData.descricao,
    ordemExibicao: updateData.ordemExibicao,
    ativa: updateData.ativa,
  });

  /**
   * @rule {BR-001}
   * Update parent's possuiSubdisciplinas flag if status changed
   */
  if (existing.disciplinaPaiId && existing.ativa !== updateData.ativa) {
    const hasActiveSubdisciplinas = disciplinaStore.hasActiveSubdisciplinas(
      existing.disciplinaPaiId
    );
    disciplinaStore.update(existing.disciplinaPaiId, {
      possuiSubdisciplinas: hasActiveSubdisciplinas,
    });
  }

  return updated as DisciplinaEntity;
}

/**
 * @summary
 * Deletes a disciplina entity by its ID.
 *
 * @function disciplinaDelete
 * @module services/disciplina
 *
 * @param {unknown} params - Raw request params containing the ID to validate
 * @param {unknown} body - Raw request body with delete confirmation
 * @returns {Promise<{ message: string }>} Success confirmation message
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID or body fails validation
 * @throws {ServiceError} NOT_FOUND (404) - When entity with given ID does not exist
 * @throws {ServiceError} HAS_SUBDISCIPLINAS (400) - When disciplina has active subdisciplinas
 * @throws {ServiceError} CONFIRMATION_REQUIRED (400) - When confirmation is not provided
 */
export async function disciplinaDelete(
  params: unknown,
  body: unknown
): Promise<{ message: string }> {
  const paramsValidation = paramsSchema.safeParse(params);

  if (!paramsValidation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, paramsValidation.error.errors);
  }

  const bodyValidation = deleteSchema.safeParse(body);

  if (!bodyValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      bodyValidation.error.errors
    );
  }

  const { id } = paramsValidation.data;
  const { confirmacaoExclusao } = bodyValidation.data;

  if (!disciplinaStore.exists(id)) {
    throw new ServiceError('NOT_FOUND', 'Disciplina não encontrada', 404);
  }

  /**
   * @rule {BR-001}
   * Check if disciplina has active subdisciplinas
   */
  if (disciplinaStore.hasActiveSubdisciplinas(id)) {
    throw new ServiceError(
      'HAS_SUBDISCIPLINAS',
      'Não é possível excluir disciplina que possui subdisciplinas ativas',
      400
    );
  }

  if (!confirmacaoExclusao) {
    throw new ServiceError('CONFIRMATION_REQUIRED', 'Confirmação de exclusão é obrigatória', 400);
  }

  const existing = disciplinaStore.getById(id);
  disciplinaStore.delete(id);

  /**
   * @rule {BR-010}
   * Update parent's possuiSubdisciplinas flag
   */
  if (existing?.disciplinaPaiId) {
    const hasActiveSubdisciplinas = disciplinaStore.hasActiveSubdisciplinas(
      existing.disciplinaPaiId
    );
    disciplinaStore.update(existing.disciplinaPaiId, {
      possuiSubdisciplinas: hasActiveSubdisciplinas,
    });
  }

  return { message: 'Disciplina excluída com sucesso' };
}

/**
 * @summary
 * Moves a disciplina in the hierarchy.
 *
 * @function disciplinaHierarchyMove
 * @module services/disciplina
 *
 * @param {unknown} params - Raw request params containing the ID to validate
 * @param {unknown} body - Raw request body with move data
 * @returns {Promise<DisciplinaEntity>} The updated disciplina entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID or body fails validation
 * @throws {ServiceError} NOT_FOUND (404) - When entity with given ID does not exist
 * @throws {ServiceError} CIRCULAR_REFERENCE (400) - When move would create circular reference
 * @throws {ServiceError} MAX_HIERARCHY_EXCEEDED (400) - When move would exceed hierarchy limit
 */
export async function disciplinaHierarchyMove(
  params: unknown,
  body: unknown
): Promise<DisciplinaEntity> {
  const paramsValidation = paramsSchema.safeParse(params);

  if (!paramsValidation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, paramsValidation.error.errors);
  }

  const bodyValidation = hierarchyMoveSchema.safeParse(body);

  if (!bodyValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      bodyValidation.error.errors
    );
  }

  const { id } = paramsValidation.data;
  const { novoPaiId, novaPosicao } = bodyValidation.data;

  const existing = disciplinaStore.getById(id);

  if (!existing) {
    throw new ServiceError('NOT_FOUND', 'Disciplina não encontrada', 404);
  }

  /**
   * @rule {BR-009}
   * Check for circular reference
   */
  if (disciplinaStore.wouldCreateCircularReference(id, novoPaiId)) {
    throw new ServiceError(
      'CIRCULAR_REFERENCE',
      'Esta operação criaria uma referência circular',
      400
    );
  }

  /**
   * @rule {BR-010}
   * Check hierarchy depth limit
   */
  if (novoPaiId) {
    const newParent = disciplinaStore.getById(novoPaiId);
    if (!newParent) {
      throw new ServiceError('PARENT_NOT_FOUND', 'Disciplina pai não encontrada', 404);
    }

    const newParentDepth = disciplinaStore.getHierarchyDepth(novoPaiId);
    if (newParentDepth >= DISCIPLINA_DEFAULTS.MAX_HIERARCHY_LEVELS) {
      throw new ServiceError(
        'MAX_HIERARCHY_EXCEEDED',
        'Operação excederia o limite de 3 níveis',
        400
      );
    }
  }

  const oldParentId = existing.disciplinaPaiId;

  const updated = disciplinaStore.update(id, {
    disciplinaPaiId: novoPaiId,
    ordemExibicao: novaPosicao,
  });

  /**
   * @rule {BR-006}
   * Update old and new parent's possuiSubdisciplinas flags
   */
  if (oldParentId) {
    const hasActiveSubdisciplinas = disciplinaStore.hasActiveSubdisciplinas(oldParentId);
    disciplinaStore.update(oldParentId, {
      possuiSubdisciplinas: hasActiveSubdisciplinas,
    });
  }

  if (novoPaiId && existing.ativa) {
    disciplinaStore.update(novoPaiId, {
      possuiSubdisciplinas: true,
    });
  }

  return updated as DisciplinaEntity;
}
