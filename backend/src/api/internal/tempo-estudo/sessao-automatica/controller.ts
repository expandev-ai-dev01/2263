/**
 * @summary
 * API controller for automatic session editing.
 * Thin layer that delegates all logic to service.
 *
 * @module api/internal/tempo-estudo/sessao-automatica/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { sessaoAutomaticaEditar } from '@/services/tempoEstudo';

/**
 * @api {put} /api/internal/tempo-estudo/sessao-automatica Edit Automatic Session
 * @apiName EditarSessaoAutomatica
 * @apiGroup TempoEstudo
 *
 * @apiBody {Number} sessaoId Session identifier
 * @apiBody {String} motivoEdicao Edit reason (interruption_correction | time_adjustment | subject_correction)
 * @apiBody {String} [novaDataHoraFim] New end datetime (ISO 8601, optional)
 * @apiBody {Number} [novaMateriaId] New subject identifier (optional)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique session identifier
 * @apiSuccess {Number} data.usuarioId User identifier
 * @apiSuccess {Number} data.materiaId Subject identifier
 * @apiSuccess {String} data.dataHoraInicio Start datetime (ISO 8601)
 * @apiSuccess {String} data.dataHoraFim End datetime (ISO 8601)
 * @apiSuccess {String} data.status Session status
 * @apiSuccess {Number} data.duracaoTotalMinutos Total duration in minutes
 * @apiSuccess {String|null} data.motivoInterrupcao Interruption reason
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | NOT_FOUND | EDIT_PERIOD_EXPIRED | INVALID_STATUS)
 * @apiError {String} error.message Error message
 */
export async function editarHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await sessaoAutomaticaEditar(req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
