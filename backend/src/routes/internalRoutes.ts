/**
 * @summary
 * Internal API routes configuration.
 * Handles authenticated endpoints for business operations.
 *
 * @module routes/internalRoutes
 */

import { Router } from 'express';
import * as materialDidaticoController from '@/api/internal/material-didatico/controller';
import * as metaDiariaController from '@/api/internal/meta-diaria/controller';
import * as progressoEstudosController from '@/api/internal/progresso-estudos/controller';
import * as tempoEstudoSessaoController from '@/api/internal/tempo-estudo/sessao/controller';
import * as tempoEstudoRegistroManualController from '@/api/internal/tempo-estudo/registro-manual/controller';
import * as tempoEstudoHistoricoController from '@/api/internal/tempo-estudo/historico/controller';
import * as tempoEstudoEstatisticasController from '@/api/internal/tempo-estudo/estatisticas/controller';
import * as tempoEstudoSessaoAutomaticaController from '@/api/internal/tempo-estudo/sessao-automatica/controller';

const router = Router();

/**
 * @rule {be-route-configuration}
 * MaterialDidatico routes - /api/internal/material-didatico
 */
router.get('/material-didatico', materialDidaticoController.listHandler);
router.post('/material-didatico', materialDidaticoController.createHandler);
router.get('/material-didatico/:id', materialDidaticoController.getHandler);
router.put('/material-didatico/:id', materialDidaticoController.updateHandler);
router.delete('/material-didatico/:id', materialDidaticoController.deleteHandler);

/**
 * @rule {be-route-configuration}
 * MetaDiaria routes - /api/internal/meta-diaria
 */
router.get('/meta-diaria', metaDiariaController.listHandler);
router.post('/meta-diaria', metaDiariaController.createHandler);
router.get('/meta-diaria/:id', metaDiariaController.getHandler);
router.put('/meta-diaria/:id', metaDiariaController.updateHandler);
router.delete('/meta-diaria/:id', metaDiariaController.deleteHandler);
router.post('/meta-diaria/:id/duplicate', metaDiariaController.duplicateHandler);

/**
 * @rule {be-route-configuration}
 * ProgressoEstudos routes - /api/internal/progresso-estudos
 */
router.post('/progresso-estudos/dashboard', progressoEstudosController.dashboardHandler);
router.post(
  '/progresso-estudos/estatisticas-tempo',
  progressoEstudosController.estatisticasTempoHandler
);
router.post(
  '/progresso-estudos/grafico-evolucao',
  progressoEstudosController.graficoEvolucaoHandler
);
router.post('/progresso-estudos/relatorio', progressoEstudosController.relatorioHandler);
router.put(
  '/progresso-estudos/preferencias-notificacao',
  progressoEstudosController.preferenciasNotificacaoHandler
);
router.post(
  '/progresso-estudos/comparacao-periodos',
  progressoEstudosController.comparacaoPeriodosHandler
);

/**
 * @rule {be-route-configuration}
 * TempoEstudo routes - /api/internal/tempo-estudo
 */
router.post('/tempo-estudo/sessao/iniciar', tempoEstudoSessaoController.iniciarHandler);
router.post('/tempo-estudo/sessao/finalizar', tempoEstudoSessaoController.finalizarHandler);
router.post('/tempo-estudo/sessao/pausar', tempoEstudoSessaoController.pausarHandler);
router.post('/tempo-estudo/sessao/retomar', tempoEstudoSessaoController.retomarHandler);

router.post('/tempo-estudo/registro-manual', tempoEstudoRegistroManualController.criarHandler);
router.put(
  '/tempo-estudo/registro-manual/:id',
  tempoEstudoRegistroManualController.atualizarHandler
);
router.delete(
  '/tempo-estudo/registro-manual/:id',
  tempoEstudoRegistroManualController.deletarHandler
);

router.get('/tempo-estudo/historico', tempoEstudoHistoricoController.obterHandler);
router.get('/tempo-estudo/estatisticas', tempoEstudoEstatisticasController.obterHandler);

router.put('/tempo-estudo/sessao-automatica', tempoEstudoSessaoAutomaticaController.editarHandler);

export default router;
