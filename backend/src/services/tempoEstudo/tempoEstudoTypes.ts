/**
 * @summary
 * Type definitions for TempoEstudo entity.
 *
 * @module services/tempoEstudo/tempoEstudoTypes
 */

import { StatusSessao, MotivoInterrupcao, MotivoEdicao } from '@/constants';

/**
 * @interface SessaoEstudoEntity
 * @description Represents a study session entity
 */
export interface SessaoEstudoEntity {
  id: number;
  usuarioId: number;
  materiaId: number;
  dataHoraInicio: string;
  dataHoraFim: string | null;
  status: StatusSessao;
  duracaoTotalMinutos: number | null;
  motivoInterrupcao: MotivoInterrupcao | null;
}

/**
 * @interface PausaEntity
 * @description Represents a pause within a study session
 */
export interface PausaEntity {
  id: number;
  sessaoId: number;
  dataHoraInicio: string;
  dataHoraFim: string | null;
  duracaoMinutos: number | null;
}

/**
 * @interface RegistroManualEntity
 * @description Represents a manual study time record
 */
export interface RegistroManualEntity {
  id: number;
  usuarioId: number;
  materiaId: number;
  dataEstudo: string;
  horarioInicio: string;
  horarioFim: string;
  duracaoMinutos: number;
  descricao: string | null;
  dataCriacao: string;
  dataAtualizacao: string | null;
}

/**
 * @interface HistoricoSessaoItem
 * @description Item in session history list
 */
export interface HistoricoSessaoItem {
  id: number;
  tipo: 'automatic_session' | 'manual_record';
  materiaNome: string;
  dataEstudo: string;
  duracaoFormatada: string;
  status: string;
  quantidadePausas?: number;
  duracaoTotalPausasFormatada?: string;
}

/**
 * @interface EstatisticasTempoResponse
 * @description Time statistics response
 */
export interface EstatisticasTempoResponse {
  tempoTotalMinutos: number;
  tempoTotalFormatado: string;
  mediaDiariaMinutos: number;
  mediaDiariaFormatada: string;
  diasComEstudo: number;
  totalSessoes: number;
  mediaSessaoMinutos: number;
  mediaSessaoFormatada: string;
  materiasMaisEstudada: string;
  consistenciaPercentual: number;
}

/**
 * @interface IniciarSessaoRequest
 * @description Request to start a study session
 */
export interface IniciarSessaoRequest {
  usuarioId: number;
  materiaId: number;
}

/**
 * @interface FinalizarSessaoRequest
 * @description Request to finish a study session
 */
export interface FinalizarSessaoRequest {
  sessaoId: number;
}

/**
 * @interface PausarSessaoRequest
 * @description Request to pause a study session
 */
export interface PausarSessaoRequest {
  sessaoId: number;
}

/**
 * @interface RetomarSessaoRequest
 * @description Request to resume a paused session
 */
export interface RetomarSessaoRequest {
  sessaoId: number;
}

/**
 * @interface CriarRegistroManualRequest
 * @description Request to create a manual time record
 */
export interface CriarRegistroManualRequest {
  usuarioId: number;
  materiaId: number;
  dataEstudo: string;
  horarioInicio: string;
  horarioFim: string;
  descricao: string | null;
}

/**
 * @interface AtualizarRegistroManualRequest
 * @description Request to update a manual time record
 */
export interface AtualizarRegistroManualRequest {
  materiaId: number;
  dataEstudo: string;
  horarioInicio: string;
  horarioFim: string;
  descricao: string | null;
}

/**
 * @interface EditarSessaoAutomaticaRequest
 * @description Request to edit an automatic session
 */
export interface EditarSessaoAutomaticaRequest {
  sessaoId: number;
  motivoEdicao: MotivoEdicao;
  novaDataHoraFim?: string;
  novaMateriaId?: number;
}

/**
 * @interface HistoricoSessoesRequest
 * @description Request to get session history
 */
export interface HistoricoSessoesRequest {
  usuarioId: number;
  materiaId?: number;
  dataInicio?: string;
  dataFim?: string;
}

/**
 * @interface EstatisticasTempoRequest
 * @description Request to get time statistics
 */
export interface EstatisticasTempoRequest {
  usuarioId: number;
  dataInicio: string;
  dataFim: string;
  materiaId?: number;
}
