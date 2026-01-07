/**
 * @summary
 * API controller for study time statistics.
 * Thin layer that delegates all logic to service.
 *
 * @module api/internal/tempo-estudo/estatisticas/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { estatisticasTempoObter } from '@/services/tempoEstudo';

/**
 * @api {get} /api/internal/tempo-estudo/estatisticas Get Time Statistics
 * @apiName ObterEstatisticasTempo
 * @apiGroup TempoEstudo
 *
 * @apiQuery {Number} usuarioId User identifier
 * @apiQuery {String} dataInicio Start date (YYYY-MM-DD)
 * @apiQuery {String} dataFim End date (YYYY-MM-DD)
 * @apiQuery {Number} [materiaId] Optional subject filter
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.tempoTotalMinutos Total study time in minutes
 * @apiSuccess {String} data.tempoTotalFormatado Total study time formatted (HH:MM)
 * @apiSuccess {Number} data.mediaDiariaMinutos Daily average in minutes
 * @apiSuccess {String} data.mediaDiariaFormatada Daily average formatted (HH:MM)
 * @apiSuccess {Number} data.diasComEstudo Number of days with study
 * @apiSuccess {Number} data.totalSessoes Total number of sessions
 * @apiSuccess {Number} data.mediaSessaoMinutos Average session duration in minutes
 * @apiSuccess {String} data.mediaSessaoFormatada Average session duration formatted (HH:MM)
 * @apiSuccess {String} data.materiasMaisEstudada Most studied subject
 * @apiSuccess {Number} data.consistenciaPercentual Study consistency percentage
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function obterHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await estatisticasTempoObter(req.query);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
