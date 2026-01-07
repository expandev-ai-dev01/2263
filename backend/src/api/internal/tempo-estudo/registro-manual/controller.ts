/**
 * @summary
 * API controller for manual time record management.
 * Thin layer that delegates all logic to service.
 *
 * @module api/internal/tempo-estudo/registro-manual/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import {
  registroManualCriar,
  registroManualAtualizar,
  registroManualDeletar,
} from '@/services/tempoEstudo';

/**
 * @api {post} /api/internal/tempo-estudo/registro-manual Create Manual Record
 * @apiName CriarRegistroManual
 * @apiGroup TempoEstudo
 *
 * @apiBody {Number} usuarioId User identifier
 * @apiBody {Number} materiaId Subject identifier
 * @apiBody {String} dataEstudo Study date (YYYY-MM-DD)
 * @apiBody {String} horarioInicio Start time (HH:MM)
 * @apiBody {String} horarioFim End time (HH:MM)
 * @apiBody {String|null} descricao Optional description (max 500 chars)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique record identifier
 * @apiSuccess {Number} data.usuarioId User identifier
 * @apiSuccess {Number} data.materiaId Subject identifier
 * @apiSuccess {String} data.dataEstudo Study date (YYYY-MM-DD)
 * @apiSuccess {String} data.horarioInicio Start time (HH:MM)
 * @apiSuccess {String} data.horarioFim End time (HH:MM)
 * @apiSuccess {Number} data.duracaoMinutos Duration in minutes
 * @apiSuccess {String|null} data.descricao Description
 * @apiSuccess {String} data.dataCriacao Creation timestamp (ISO 8601)
 * @apiSuccess {String|null} data.dataAtualizacao Update timestamp (ISO 8601)
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | TIME_OVERLAP | DAILY_LIMIT_EXCEEDED)
 * @apiError {String} error.message Error message
 */
export async function criarHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await registroManualCriar(req.body);
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
 * @api {put} /api/internal/tempo-estudo/registro-manual/:id Update Manual Record
 * @apiName AtualizarRegistroManual
 * @apiGroup TempoEstudo
 *
 * @apiParam {Number} id Manual record ID
 *
 * @apiBody {Number} materiaId Subject identifier
 * @apiBody {String} dataEstudo Study date (YYYY-MM-DD)
 * @apiBody {String} horarioInicio Start time (HH:MM)
 * @apiBody {String} horarioFim End time (HH:MM)
 * @apiBody {String|null} descricao Optional description (max 500 chars)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique record identifier
 * @apiSuccess {Number} data.usuarioId User identifier
 * @apiSuccess {Number} data.materiaId Subject identifier
 * @apiSuccess {String} data.dataEstudo Study date (YYYY-MM-DD)
 * @apiSuccess {String} data.horarioInicio Start time (HH:MM)
 * @apiSuccess {String} data.horarioFim End time (HH:MM)
 * @apiSuccess {Number} data.duracaoMinutos Duration in minutes
 * @apiSuccess {String|null} data.descricao Description
 * @apiSuccess {String} data.dataCriacao Creation timestamp (ISO 8601)
 * @apiSuccess {String} data.dataAtualizacao Update timestamp (ISO 8601)
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | NOT_FOUND | EDIT_PERIOD_EXPIRED | TIME_OVERLAP)
 * @apiError {String} error.message Error message
 */
export async function atualizarHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await registroManualAtualizar(req.params, req.body);
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
 * @api {delete} /api/internal/tempo-estudo/registro-manual/:id Delete Manual Record
 * @apiName DeletarRegistroManual
 * @apiGroup TempoEstudo
 *
 * @apiParam {Number} id Manual record ID
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | NOT_FOUND)
 * @apiError {String} error.message Error message
 */
export async function deletarHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await registroManualDeletar(req.params);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
