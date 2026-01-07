/**
 * @summary
 * API controller for MetaDiaria entity.
 * Thin layer that delegates all logic to service.
 *
 * @module api/internal/meta-diaria/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import {
  metaDiariaCreate,
  metaDiariaList,
  metaDiariaGet,
  metaDiariaUpdate,
  metaDiariaDelete,
  metaDiariaDuplicate,
} from '@/services/metaDiaria';

/**
 * @api {get} /api/internal/meta-diaria List Metas Diárias
 * @apiName ListMetasDiarias
 * @apiGroup MetaDiaria
 *
 * @apiQuery {Number} [usuarioId] Filter by user ID
 * @apiQuery {String} [dataMeta] Filter by date (YYYY-MM-DD)
 * @apiQuery {String} [status] Filter by status (ativa | inativa | concluida | todas)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Object[]} data List of metas diárias
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {String} data.dataMeta Goal date (YYYY-MM-DD)
 * @apiSuccess {String} data.tituloMeta Goal title
 * @apiSuccess {String} data.prioridade Priority level (alta | media | baixa)
 * @apiSuccess {String} data.status Goal status (ativa | inativa | concluida)
 * @apiSuccess {Number} data.totalSessoes Total number of sessions
 * @apiSuccess {String} data.dataCriacao ISO 8601 timestamp
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await metaDiariaList(req.query);
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
 * @api {post} /api/internal/meta-diaria Create Meta Diária
 * @apiName CreateMetaDiaria
 * @apiGroup MetaDiaria
 *
 * @apiBody {Number} usuarioId User identifier
 * @apiBody {String} dataMeta Goal date (YYYY-MM-DD, not in the past)
 * @apiBody {String} tituloMeta Goal title (3-100 chars, alphanumeric with - and _)
 * @apiBody {Number|null} tempoTotalDesejado Desired total time in minutes (optional, multiple of 15, min 15)
 * @apiBody {Object[]} horariosPreferenciais Preferred time slots (max 20)
 * @apiBody {String} horariosPreferenciais.horarioInicio Start time (HH:MM)
 * @apiBody {String} horariosPreferenciais.horarioFim End time (HH:MM, must be after start)
 * @apiBody {Number[]} materiasSelecionadas Selected subject IDs (1-20 items)
 * @apiBody {String[]} topicosEspecificos Specific topics (max 30, 3-100 chars each)
 * @apiBody {String} prioridade Priority level (alta | media | baixa)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {Number} data.usuarioId User identifier
 * @apiSuccess {String} data.dataMeta Goal date (YYYY-MM-DD)
 * @apiSuccess {String} data.tituloMeta Goal title
 * @apiSuccess {Number|null} data.tempoTotalDesejado Desired total time in minutes
 * @apiSuccess {Object[]} data.horariosPreferenciais Preferred time slots
 * @apiSuccess {String} data.horariosPreferenciais.horarioInicio Start time (HH:MM)
 * @apiSuccess {String} data.horariosPreferenciais.horarioFim End time (HH:MM)
 * @apiSuccess {Number[]} data.materiasSelecionadas Selected subject IDs
 * @apiSuccess {String[]} data.topicosEspecificos Specific topics
 * @apiSuccess {String} data.prioridade Priority level (alta | media | baixa)
 * @apiSuccess {String} data.status Goal status (ativa | inativa | concluida)
 * @apiSuccess {String} data.dataCriacao ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await metaDiariaCreate(req.body);
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
 * @api {get} /api/internal/meta-diaria/:id Get Meta Diária
 * @apiName GetMetaDiaria
 * @apiGroup MetaDiaria
 *
 * @apiParam {Number} id Meta diária ID
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {Number} data.usuarioId User identifier
 * @apiSuccess {String} data.dataMeta Goal date (YYYY-MM-DD)
 * @apiSuccess {String} data.tituloMeta Goal title
 * @apiSuccess {Number|null} data.tempoTotalDesejado Desired total time in minutes
 * @apiSuccess {Object[]} data.horariosPreferenciais Preferred time slots
 * @apiSuccess {String} data.horariosPreferenciais.horarioInicio Start time (HH:MM)
 * @apiSuccess {String} data.horariosPreferenciais.horarioFim End time (HH:MM)
 * @apiSuccess {Number[]} data.materiasSelecionadas Selected subject IDs
 * @apiSuccess {String[]} data.topicosEspecificos Specific topics
 * @apiSuccess {String} data.prioridade Priority level (alta | media | baixa)
 * @apiSuccess {String} data.status Goal status (ativa | inativa | concluida)
 * @apiSuccess {String} data.dataCriacao ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await metaDiariaGet(req.params);
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
 * @api {put} /api/internal/meta-diaria/:id Update Meta Diária
 * @apiName UpdateMetaDiaria
 * @apiGroup MetaDiaria
 *
 * @apiParam {Number} id Meta diária ID
 *
 * @apiBody {String} tituloMeta Goal title (3-100 chars, alphanumeric with - and _)
 * @apiBody {Number|null} tempoTotalDesejado Desired total time in minutes (optional, multiple of 15, min 15)
 * @apiBody {Object[]} horariosPreferenciais Preferred time slots (max 20)
 * @apiBody {String} horariosPreferenciais.horarioInicio Start time (HH:MM)
 * @apiBody {String} horariosPreferenciais.horarioFim End time (HH:MM, must be after start)
 * @apiBody {Number[]} materiasSelecionadas Selected subject IDs (1-20 items)
 * @apiBody {String[]} topicosEspecificos Specific topics (max 30, 3-100 chars each)
 * @apiBody {String} prioridade Priority level (alta | media | baixa)
 * @apiBody {String} status Goal status (ativa | inativa | concluida)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {Number} data.usuarioId User identifier
 * @apiSuccess {String} data.dataMeta Goal date (YYYY-MM-DD)
 * @apiSuccess {String} data.tituloMeta Goal title
 * @apiSuccess {Number|null} data.tempoTotalDesejado Desired total time in minutes
 * @apiSuccess {Object[]} data.horariosPreferenciais Preferred time slots
 * @apiSuccess {String} data.horariosPreferenciais.horarioInicio Start time (HH:MM)
 * @apiSuccess {String} data.horariosPreferenciais.horarioFim End time (HH:MM)
 * @apiSuccess {Number[]} data.materiasSelecionadas Selected subject IDs
 * @apiSuccess {String[]} data.topicosEspecificos Specific topics
 * @apiSuccess {String} data.prioridade Priority level (alta | media | baixa)
 * @apiSuccess {String} data.status Goal status (ativa | inativa | concluida)
 * @apiSuccess {String} data.dataCriacao ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await metaDiariaUpdate(req.params, req.body);
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
 * @api {delete} /api/internal/meta-diaria/:id Delete Meta Diária
 * @apiName DeleteMetaDiaria
 * @apiGroup MetaDiaria
 *
 * @apiParam {Number} id Meta diária ID
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
    const data = await metaDiariaDelete(req.params);
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
 * @api {post} /api/internal/meta-diaria/:id/duplicate Duplicate Meta Diária
 * @apiName DuplicateMetaDiaria
 * @apiGroup MetaDiaria
 *
 * @apiParam {Number} id Meta diária ID to duplicate
 *
 * @apiBody {String} dataDestino Destination date (YYYY-MM-DD, not in the past)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id New unique identifier
 * @apiSuccess {Number} data.usuarioId User identifier
 * @apiSuccess {String} data.dataMeta New goal date (YYYY-MM-DD)
 * @apiSuccess {String} data.tituloMeta Goal title (copied)
 * @apiSuccess {Number|null} data.tempoTotalDesejado Desired total time in minutes (copied)
 * @apiSuccess {Object[]} data.horariosPreferenciais Preferred time slots (copied)
 * @apiSuccess {String} data.horariosPreferenciais.horarioInicio Start time (HH:MM)
 * @apiSuccess {String} data.horariosPreferenciais.horarioFim End time (HH:MM)
 * @apiSuccess {Number[]} data.materiasSelecionadas Selected subject IDs (copied)
 * @apiSuccess {String[]} data.topicosEspecificos Specific topics (copied)
 * @apiSuccess {String} data.prioridade Priority level (copied)
 * @apiSuccess {String} data.status Goal status (always 'ativa' for new duplicate)
 * @apiSuccess {String} data.dataCriacao ISO 8601 timestamp (new)
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function duplicateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await metaDiariaDuplicate(req.params, req.body);
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
