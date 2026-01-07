/**
 * @summary
 * API controller for Disciplina entity.
 * Thin layer that delegates all logic to service.
 *
 * @module api/internal/disciplina/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import {
  disciplinaCreate,
  disciplinaList,
  disciplinaGet,
  disciplinaUpdate,
  disciplinaDelete,
  disciplinaHierarchyMove,
} from '@/services/disciplina';

/**
 * @api {get} /api/internal/disciplina List Disciplinas
 * @apiName ListDisciplinas
 * @apiGroup Disciplina
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Object[]} data List of disciplinas
 * @apiSuccess {String} data.id Unique identifier (UUID)
 * @apiSuccess {String} data.nomeDisciplina Disciplina name
 * @apiSuccess {String|null} data.disciplinaPaiId Parent disciplina ID
 * @apiSuccess {Number} data.ordemExibicao Display order
 * @apiSuccess {Boolean} data.ativa Active status
 * @apiSuccess {Boolean} data.possuiSubdisciplinas Has active subdisciplinas
 * @apiSuccess {String} data.dataCriacao ISO 8601 timestamp
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await disciplinaList();
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/disciplina Create Disciplina
 * @apiName CreateDisciplina
 * @apiGroup Disciplina
 *
 * @apiBody {String} nomeDisciplina Disciplina name (3-100 chars, alphanumeric with - and space)
 * @apiBody {String|null} descricao Description (max 500 chars)
 * @apiBody {String|null} disciplinaPaiId Parent disciplina ID (optional)
 * @apiBody {Number} ordemExibicao Display order (positive integer)
 * @apiBody {Boolean} ativa Active status
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.id Unique identifier (UUID)
 * @apiSuccess {String} data.nomeDisciplina Disciplina name
 * @apiSuccess {String|null} data.descricao Description
 * @apiSuccess {String|null} data.disciplinaPaiId Parent disciplina ID
 * @apiSuccess {Number} data.ordemExibicao Display order
 * @apiSuccess {Boolean} data.ativa Active status
 * @apiSuccess {Boolean} data.possuiSubdisciplinas Has active subdisciplinas
 * @apiSuccess {String} data.dataCriacao ISO 8601 timestamp
 * @apiSuccess {String} data.dataAtualizacao ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | DUPLICATE_NAME | MAX_HIERARCHY_EXCEEDED | PARENT_NOT_FOUND | CIRCULAR_REFERENCE)
 * @apiError {String} error.message Error message
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await disciplinaCreate(req.body);
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {get} /api/internal/disciplina/:id Get Disciplina
 * @apiName GetDisciplina
 * @apiGroup Disciplina
 *
 * @apiParam {String} id Disciplina ID (UUID)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.id Unique identifier (UUID)
 * @apiSuccess {String} data.nomeDisciplina Disciplina name
 * @apiSuccess {String|null} data.descricao Description
 * @apiSuccess {String|null} data.disciplinaPaiId Parent disciplina ID
 * @apiSuccess {Number} data.ordemExibicao Display order
 * @apiSuccess {Boolean} data.ativa Active status
 * @apiSuccess {Boolean} data.possuiSubdisciplinas Has active subdisciplinas
 * @apiSuccess {String} data.dataCriacao ISO 8601 timestamp
 * @apiSuccess {String} data.dataAtualizacao ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await disciplinaGet(req.params);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {put} /api/internal/disciplina/:id Update Disciplina
 * @apiName UpdateDisciplina
 * @apiGroup Disciplina
 *
 * @apiParam {String} id Disciplina ID (UUID)
 *
 * @apiBody {String} nomeDisciplina Disciplina name (3-100 chars, alphanumeric with - and space)
 * @apiBody {String|null} descricao Description (max 500 chars)
 * @apiBody {Number} ordemExibicao Display order (positive integer)
 * @apiBody {Boolean} ativa Active status
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.id Unique identifier (UUID)
 * @apiSuccess {String} data.nomeDisciplina Disciplina name
 * @apiSuccess {String|null} data.descricao Description
 * @apiSuccess {String|null} data.disciplinaPaiId Parent disciplina ID
 * @apiSuccess {Number} data.ordemExibicao Display order
 * @apiSuccess {Boolean} data.ativa Active status
 * @apiSuccess {Boolean} data.possuiSubdisciplinas Has active subdisciplinas
 * @apiSuccess {String} data.dataCriacao ISO 8601 timestamp
 * @apiSuccess {String} data.dataAtualizacao ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR | DUPLICATE_NAME | CANNOT_DEACTIVATE)
 * @apiError {String} error.message Error message
 */
export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await disciplinaUpdate(req.params, req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {delete} /api/internal/disciplina/:id Delete Disciplina
 * @apiName DeleteDisciplina
 * @apiGroup Disciplina
 *
 * @apiParam {String} id Disciplina ID (UUID)
 *
 * @apiBody {Boolean} confirmacaoExclusao Explicit deletion confirmation (must be true)
 * @apiBody {String|null} motivoExclusao Reason for deletion (optional, max 200 chars)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR | HAS_SUBDISCIPLINAS | CONFIRMATION_REQUIRED)
 * @apiError {String} error.message Error message
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await disciplinaDelete(req.params, req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {put} /api/internal/disciplina/:id/move Move Disciplina in Hierarchy
 * @apiName MoveDisciplina
 * @apiGroup Disciplina
 *
 * @apiParam {String} id Disciplina ID (UUID)
 *
 * @apiBody {String|null} novoPaiId New parent disciplina ID (null for root)
 * @apiBody {Number} novaPosicao New position in order (positive integer)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.id Unique identifier (UUID)
 * @apiSuccess {String} data.nomeDisciplina Disciplina name
 * @apiSuccess {String|null} data.descricao Description
 * @apiSuccess {String|null} data.disciplinaPaiId Parent disciplina ID
 * @apiSuccess {Number} data.ordemExibicao Display order
 * @apiSuccess {Boolean} data.ativa Active status
 * @apiSuccess {Boolean} data.possuiSubdisciplinas Has active subdisciplinas
 * @apiSuccess {String} data.dataCriacao ISO 8601 timestamp
 * @apiSuccess {String} data.dataAtualizacao ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR | CIRCULAR_REFERENCE | MAX_HIERARCHY_EXCEEDED | PARENT_NOT_FOUND)
 * @apiError {String} error.message Error message
 */
export async function moveHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await disciplinaHierarchyMove(req.params, req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
