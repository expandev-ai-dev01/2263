/**
 * @summary
 * Centralized service instances exports.
 * Provides single import point for all service configurations and instances.
 *
 * @module instances
 */

/**
 * MaterialDidatico instances
 */
export { materialDidaticoStore, type MaterialDidaticoRecord } from './materialDidatico';

/**
 * MetaDiaria instances
 */
export { metaDiariaStore, type MetaDiariaRecord } from './metaDiaria';

/**
 * ProgressoEstudos instances
 */
export {
  progressoEstudosStore,
  type ConteudoConcluidoRecord,
  type SessaoEstudoRecord,
  type PreferenciasNotificacaoRecord,
  type NotificacaoMarcoRecord,
} from './progressoEstudos';
