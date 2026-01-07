/**
 * @summary
 * API controller for ProgressoEstudos entity.
 * Thin layer that delegates all logic to service.
 *
 * @module api/internal/progresso-estudos/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import {
  dashboardProgressoGet,
  estatisticasTempoGet,
  graficoEvolucaoGet,
  relatorioProgressoGenerate,
  preferenciasNotificacaoUpdate,
  comparacaoPeriodosGet,
} from '@/services/progressoEstudos';

/**
 * @api {post} /api/internal/progresso-estudos/dashboard Get Dashboard Progress
 * @apiName GetDashboardProgress
 * @apiGroup ProgressoEstudos
 *
 * @apiBody {Number} usuarioId User identifier
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.progressoGeralPercentual Overall progress percentage (0-100)
 * @apiSuccess {Number} data.conteudosConcluidos Number of completed contents
 * @apiSuccess {Number} data.conteudosTotais Total number of contents
 * @apiSuccess {Number} data.streakDiasConsecutivos Consecutive study days streak
 * @apiSuccess {Number} data.conteudosAdicionadosRecentemente Recently added contents count
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function dashboardHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await dashboardProgressoGet(req.body);
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
 * @api {post} /api/internal/progresso-estudos/estatisticas-tempo Get Time Statistics
 * @apiName GetTimeStatistics
 * @apiGroup ProgressoEstudos
 *
 * @apiBody {Number} usuarioId User identifier
 * @apiBody {String} periodoReferencia Reference period (diario | semanal | mensal)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.tempoEstudoDiario Daily study time in minutes
 * @apiSuccess {Number} data.tempoEstudoSemanal Weekly study time in minutes
 * @apiSuccess {Number} data.tempoEstudoMensal Monthly study time in minutes
 * @apiSuccess {String} data.periodoReferencia Selected reference period
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function estatisticasTempoHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await estatisticasTempoGet(req.body);
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
 * @api {post} /api/internal/progresso-estudos/grafico-evolucao Get Evolution Chart
 * @apiName GetEvolutionChart
 * @apiGroup ProgressoEstudos
 *
 * @apiBody {Number} usuarioId User identifier
 * @apiBody {String} tipoGrafico Chart type (linha | barra | area)
 * @apiBody {String} periodoGrafico Chart period (7dias | 30dias | 90dias | 1ano)
 * @apiBody {String} metricaExibida Displayed metric (tempo_estudo | conteudos_concluidos | desempenho_questoes | percentual_acertos | questoes_resolvidas)
 * @apiBody {Object} [filtros] Optional filters
 * @apiBody {String} [filtros.filtroMateria] Subject filter
 * @apiBody {String} [filtros.filtroDisciplina] Discipline filter
 * @apiBody {String} [filtros.filtroCategoria] Category filter
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.tipoGrafico Chart type
 * @apiSuccess {String} data.periodoGrafico Chart period
 * @apiSuccess {String} data.metricaExibida Displayed metric
 * @apiSuccess {Object[]} data.dados Chart data points
 * @apiSuccess {String} data.dados.data Date (YYYY-MM-DD)
 * @apiSuccess {Number} data.dados.valor Value
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function graficoEvolucaoHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await graficoEvolucaoGet(req.body);
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
 * @api {post} /api/internal/progresso-estudos/relatorio Generate Progress Report
 * @apiName GenerateProgressReport
 * @apiGroup ProgressoEstudos
 *
 * @apiBody {Number} usuarioId User identifier
 * @apiBody {String} tipoRelatorio Report type (completo | resumido | personalizado)
 * @apiBody {String} formatoExportacao Export format (pdf | excel | ods | csv)
 * @apiBody {String} periodoRelatorio Report period (ultima_semana | ultimo_mes | ultimos_3_meses | personalizado)
 * @apiBody {String} [dataInicioPersonalizada] Custom start date (YYYY-MM-DD, required if period is personalizado)
 * @apiBody {String} [dataFimPersonalizada] Custom end date (YYYY-MM-DD, required if period is personalizado)
 * @apiBody {Object} [filtros] Optional filters
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.tipoRelatorio Report type
 * @apiSuccess {String} data.formatoExportacao Export format
 * @apiSuccess {String} data.periodoRelatorio Report period
 * @apiSuccess {String} [data.dataInicioPersonalizada] Custom start date
 * @apiSuccess {String} [data.dataFimPersonalizada] Custom end date
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function relatorioHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await relatorioProgressoGenerate(req.body);
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
 * @api {put} /api/internal/progresso-estudos/preferencias-notificacao Update Notification Preferences
 * @apiName UpdateNotificationPreferences
 * @apiGroup ProgressoEstudos
 *
 * @apiBody {Number} usuarioId User identifier
 * @apiBody {Boolean} notificacaoPushHabilitada Enable push notifications
 * @apiBody {Boolean} notificacaoEmailHabilitada Enable email notifications
 * @apiBody {Boolean} notificacaoSmsHabilitada Enable SMS notifications
 * @apiBody {String[]} tiposMarcoHabilitados Enabled milestone types (meta_atingida | streak_milestone | progresso_percentual)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Boolean} data.notificacaoPushHabilitada Push notifications enabled
 * @apiSuccess {Boolean} data.notificacaoEmailHabilitada Email notifications enabled
 * @apiSuccess {Boolean} data.notificacaoSmsHabilitada SMS notifications enabled
 * @apiSuccess {String[]} data.tiposMarcoHabilitados Enabled milestone types
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function preferenciasNotificacaoHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await preferenciasNotificacaoUpdate(req.body);
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
 * @api {post} /api/internal/progresso-estudos/comparacao-periodos Get Period Comparison
 * @apiName GetPeriodComparison
 * @apiGroup ProgressoEstudos
 *
 * @apiBody {Number} usuarioId User identifier
 * @apiBody {String} periodoAtual Current period (esta_semana | este_mes | este_trimestre)
 * @apiBody {String} periodoComparacao Comparison period (semana_anterior | mes_anterior | trimestre_anterior)
 * @apiBody {String} metricaComparacao Comparison metric (tempo_estudo | conteudos_concluidos | desempenho_questoes)
 * @apiBody {Object} [filtros] Optional filters
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.periodoAtual Current period
 * @apiSuccess {String} data.periodoComparacao Comparison period
 * @apiSuccess {Number} data.variacaoPercentual Percentage variation
 * @apiSuccess {String} data.metricaComparacao Comparison metric
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function comparacaoPeriodosHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await comparacaoPeriodosGet(req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
