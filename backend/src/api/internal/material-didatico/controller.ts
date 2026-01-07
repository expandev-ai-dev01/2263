/**
 * @summary
 * API controller for MaterialDidatico entity.
 * Thin layer that delegates all logic to service.
 *
 * @module api/internal/material-didatico/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import {
  materialDidaticoCreate,
  materialDidaticoList,
  materialDidaticoGet,
  materialDidaticoUpdate,
  materialDidaticoDelete,
} from '@/services/materialDidatico';

/**
 * @api {get} /api/internal/material-didatico List Materiais Didáticos
 * @apiName ListMateriaisDidaticos
 * @apiGroup MaterialDidatico
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Object[]} data List of materiais didáticos
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {String} data.titulo Material title
 * @apiSuccess {Number} data.editalId Related edital identifier
 * @apiSuccess {Number} data.disciplinaId Related disciplina identifier
 * @apiSuccess {String} data.nivelDificuldade Difficulty level (basico | intermediario | avancado)
 * @apiSuccess {String} data.status Material status (ativo | inativo | processando)
 * @apiSuccess {String} data.dataCadastro ISO 8601 timestamp
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await materialDidaticoList();
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
 * @api {post} /api/internal/material-didatico Create Material Didático
 * @apiName CreateMaterialDidatico
 * @apiGroup MaterialDidatico
 *
 * @apiBody {String} titulo Material title (5-200 chars)
 * @apiBody {Number} editalId Related edital identifier
 * @apiBody {Number} disciplinaId Related disciplina identifier
 * @apiBody {String|null} descricao Material description (max 1000 chars)
 * @apiBody {String} arquivoPdf PDF file path (max 255 chars)
 * @apiBody {String[]} tags Search keywords (max 10 tags, 2-30 chars each)
 * @apiBody {String} nivelDificuldade Difficulty level (basico | intermediario | avancado)
 * @apiBody {Number} [ordemApresentacao] Presentation order (optional, auto-calculated)
 * @apiBody {Number} usuarioCadastro User creating the material
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {String} data.titulo Material title
 * @apiSuccess {Number} data.editalId Related edital identifier
 * @apiSuccess {Number} data.disciplinaId Related disciplina identifier
 * @apiSuccess {String|null} data.descricao Material description
 * @apiSuccess {String} data.arquivoPdf PDF file path
 * @apiSuccess {String[]} data.tags Search keywords
 * @apiSuccess {String} data.nivelDificuldade Difficulty level (basico | intermediario | avancado)
 * @apiSuccess {Number} data.ordemApresentacao Presentation order
 * @apiSuccess {String} data.status Material status (ativo | inativo | processando)
 * @apiSuccess {String} data.dataCadastro ISO 8601 timestamp
 * @apiSuccess {Number} data.usuarioCadastro User who created the material
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | DUPLICATE_TITULO)
 * @apiError {String} error.message Error message
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await materialDidaticoCreate(req.body);
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
 * @api {get} /api/internal/material-didatico/:id Get Material Didático
 * @apiName GetMaterialDidatico
 * @apiGroup MaterialDidatico
 *
 * @apiParam {Number} id Material didático ID
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {String} data.titulo Material title
 * @apiSuccess {Number} data.editalId Related edital identifier
 * @apiSuccess {Number} data.disciplinaId Related disciplina identifier
 * @apiSuccess {String|null} data.descricao Material description
 * @apiSuccess {String} data.arquivoPdf PDF file path
 * @apiSuccess {String[]} data.tags Search keywords
 * @apiSuccess {String} data.nivelDificuldade Difficulty level (basico | intermediario | avancado)
 * @apiSuccess {Number} data.ordemApresentacao Presentation order
 * @apiSuccess {String} data.status Material status (ativo | inativo | processando)
 * @apiSuccess {String} data.dataCadastro ISO 8601 timestamp
 * @apiSuccess {Number} data.usuarioCadastro User who created the material
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await materialDidaticoGet(req.params);
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
 * @api {put} /api/internal/material-didatico/:id Update Material Didático
 * @apiName UpdateMaterialDidatico
 * @apiGroup MaterialDidatico
 *
 * @apiParam {Number} id Material didático ID
 *
 * @apiBody {String} titulo Material title (5-200 chars)
 * @apiBody {String|null} descricao Material description (max 1000 chars)
 * @apiBody {String[]} tags Search keywords (max 10 tags, 2-30 chars each)
 * @apiBody {String} nivelDificuldade Difficulty level (basico | intermediario | avancado)
 * @apiBody {Number} ordemApresentacao Presentation order
 * @apiBody {String} status Material status (ativo | inativo | processando)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {String} data.titulo Material title
 * @apiSuccess {Number} data.editalId Related edital identifier
 * @apiSuccess {Number} data.disciplinaId Related disciplina identifier
 * @apiSuccess {String|null} data.descricao Material description
 * @apiSuccess {String} data.arquivoPdf PDF file path
 * @apiSuccess {String[]} data.tags Search keywords
 * @apiSuccess {String} data.nivelDificuldade Difficulty level (basico | intermediario | avancado)
 * @apiSuccess {Number} data.ordemApresentacao Presentation order
 * @apiSuccess {String} data.status Material status (ativo | inativo | processando)
 * @apiSuccess {String} data.dataCadastro ISO 8601 timestamp
 * @apiSuccess {Number} data.usuarioCadastro User who created the material
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR | DUPLICATE_TITULO)
 * @apiError {String} error.message Error message
 */
export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await materialDidaticoUpdate(req.params, req.body);
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
 * @api {delete} /api/internal/material-didatico/:id Delete Material Didático
 * @apiName DeleteMaterialDidatico
 * @apiGroup MaterialDidatico
 *
 * @apiParam {Number} id Material didático ID
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await materialDidaticoDelete(req.params);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
