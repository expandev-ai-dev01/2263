/**
 * @summary
 * Internal API routes configuration.
 * Handles authenticated endpoints for business operations.
 *
 * @module routes/internalRoutes
 */

import { Router } from 'express';
import * as materialDidaticoController from '@/api/internal/material-didatico/controller';

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

export default router;
