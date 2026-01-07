/**
 * @summary
 * API controller for study session history.
 * Thin layer that delegates all logic to service.
 *
 * @module api/internal/tempo-estudo/historico/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { historicoSessoesObter } from '@/services/tempoEstudo';

/**
 * @api {get} /api/internal/tempo-estudo/historico Get Session History
 * @apiName ObterHistoricoSessoes
 * @apiGroup TempoEstudo
 *
 * @apiQuery {Number} usuarioId User identifier
 * @apiQuery {Number} [materiaId] Optional subject filter
 * @apiQuery {String} [dataInicio] Optional start date filter (YYYY-MM-DD)
 * @apiQuery {String} [dataFim] Optional end date filter (YYYY-MM-DD)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Object[]} data List of session history items
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {String} data.tipo Session type (automatic_session | manual_record)
 * @apiSuccess {String} data.materiaNome Subject name
 * @apiSuccess {String} data.dataEstudo Study date (YYYY-MM-DD)
 * @apiSuccess {String} data.duracaoFormatada Duration formatted (HH:MM)
 * @apiSuccess {String} data.status Session status (Concluída | Interrompida | Manual)
 * @apiSuccess {Number} [data.quantidadePausas] Number of pauses (automatic sessions only)
 * @apiSuccess {String} [data.duracaoTotalPausasFormatada] Total pause duration formatted (HH:MM, automatic sessions only)
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function obterHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await historicoSessoesObter(req.query);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
