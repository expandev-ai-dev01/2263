/**
 * @summary
 * API controller for study session management.
 * Thin layer that delegates all logic to service.
 *
 * @module api/internal/tempo-estudo/sessao/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import {
  sessaoIniciar,
  sessaoFinalizar,
  sessaoPausar,
  sessaoRetomar,
} from '@/services/tempoEstudo';

/**
 * @api {post} /api/internal/tempo-estudo/sessao/iniciar Start Study Session
 * @apiName IniciarSessao
 * @apiGroup TempoEstudo
 *
 * @apiBody {Number} usuarioId User identifier
 * @apiBody {Number} materiaId Subject identifier
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique session identifier
 * @apiSuccess {Number} data.usuarioId User identifier
 * @apiSuccess {Number} data.materiaId Subject identifier
 * @apiSuccess {String} data.dataHoraInicio Start datetime (ISO 8601)
 * @apiSuccess {String|null} data.dataHoraFim End datetime (ISO 8601, null if active)
 * @apiSuccess {String} data.status Session status (active | paused | completed | interrupted)
 * @apiSuccess {Number|null} data.duracaoTotalMinutos Total duration in minutes (null if active)
 * @apiSuccess {String|null} data.motivoInterrupcao Interruption reason (null if not interrupted)
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | ACTIVE_SESSION_EXISTS)
 * @apiError {String} error.message Error message
 */
export async function iniciarHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await sessaoIniciar(req.body);
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
 * @api {post} /api/internal/tempo-estudo/sessao/finalizar Finish Study Session
 * @apiName FinalizarSessao
 * @apiGroup TempoEstudo
 *
 * @apiBody {Number} sessaoId Session identifier
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique session identifier
 * @apiSuccess {Number} data.usuarioId User identifier
 * @apiSuccess {Number} data.materiaId Subject identifier
 * @apiSuccess {String} data.dataHoraInicio Start datetime (ISO 8601)
 * @apiSuccess {String} data.dataHoraFim End datetime (ISO 8601)
 * @apiSuccess {String} data.status Session status (completed)
 * @apiSuccess {Number} data.duracaoTotalMinutos Total duration in minutes
 * @apiSuccess {String|null} data.motivoInterrupcao Interruption reason (null)
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | NOT_FOUND | INVALID_STATUS | SESSION_TOO_SHORT)
 * @apiError {String} error.message Error message
 */
export async function finalizarHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await sessaoFinalizar(req.body);
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
 * @api {post} /api/internal/tempo-estudo/sessao/pausar Pause Study Session
 * @apiName PausarSessao
 * @apiGroup TempoEstudo
 *
 * @apiBody {Number} sessaoId Session identifier
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique session identifier
 * @apiSuccess {Number} data.usuarioId User identifier
 * @apiSuccess {Number} data.materiaId Subject identifier
 * @apiSuccess {String} data.dataHoraInicio Start datetime (ISO 8601)
 * @apiSuccess {String|null} data.dataHoraFim End datetime (ISO 8601, null)
 * @apiSuccess {String} data.status Session status (paused)
 * @apiSuccess {Number|null} data.duracaoTotalMinutos Total duration in minutes (null)
 * @apiSuccess {String|null} data.motivoInterrupcao Interruption reason (null)
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | NOT_FOUND | INVALID_STATUS)
 * @apiError {String} error.message Error message
 */
export async function pausarHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await sessaoPausar(req.body);
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
 * @api {post} /api/internal/tempo-estudo/sessao/retomar Resume Study Session
 * @apiName RetomarSessao
 * @apiGroup TempoEstudo
 *
 * @apiBody {Number} sessaoId Session identifier
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique session identifier
 * @apiSuccess {Number} data.usuarioId User identifier
 * @apiSuccess {Number} data.materiaId Subject identifier
 * @apiSuccess {String} data.dataHoraInicio Start datetime (ISO 8601)
 * @apiSuccess {String|null} data.dataHoraFim End datetime (ISO 8601, null)
 * @apiSuccess {String} data.status Session status (active)
 * @apiSuccess {Number|null} data.duracaoTotalMinutos Total duration in minutes (null)
 * @apiSuccess {String|null} data.motivoInterrupcao Interruption reason (null)
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | NOT_FOUND | INVALID_STATUS | PAUSE_TIMEOUT)
 * @apiError {String} error.message Error message
 */
export async function retomarHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await sessaoRetomar(req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
