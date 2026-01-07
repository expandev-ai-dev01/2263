/**
 * @module domain/tempo-estudo/types
 * @description Type definitions for Tempo de Estudo domain
 */

export interface SessaoEstudo {
  id: number;
  usuarioId: number;
  materiaId: number;
  dataHoraInicio: string;
  dataHoraFim: string | null;
  status: 'active' | 'paused' | 'completed' | 'interrupted';
  duracaoTotalMinutos: number | null;
  motivoInterrupcao: string | null;
}

export interface PausaSessao {
  id: number;
  sessaoId: number;
  pausaInicio: string;
  pausaFim: string | null;
  duracaoPausaMinutos: number | null;
}

export interface RegistroManual {
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

export interface HistoricoSessao {
  id: number;
  tipo: 'automatic_session' | 'manual_record';
  materiaNome: string;
  dataEstudo: string;
  duracaoFormatada: string;
  status: 'Concluída' | 'Interrompida' | 'Manual';
  quantidadePausas?: number;
  duracaoTotalPausasFormatada?: string;
}

export interface EstatisticasTempo {
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

export interface IniciarSessaoDto {
  usuarioId: number;
  materiaId: number;
}

export interface FinalizarSessaoDto {
  sessaoId: number;
}

export interface PausarSessaoDto {
  sessaoId: number;
}

export interface RetomarSessaoDto {
  sessaoId: number;
}

export interface CriarRegistroManualDto {
  usuarioId: number;
  materiaId: number;
  dataEstudo: string;
  horarioInicio: string;
  horarioFim: string;
  descricao?: string | null;
}

export interface AtualizarRegistroManualDto {
  materiaId: number;
  dataEstudo: string;
  horarioInicio: string;
  horarioFim: string;
  descricao?: string | null;
}

export interface EditarSessaoAutomaticaDto {
  sessaoId: number;
  motivoEdicao: 'interruption_correction' | 'time_adjustment' | 'subject_correction';
  novaDataHoraFim?: string;
  novaMateriaId?: number;
}

export interface ObterHistoricoParams {
  usuarioId: number;
  materiaId?: number;
  dataInicio?: string;
  dataFim?: string;
}

export interface ObterEstatisticasParams {
  usuarioId: number;
  dataInicio: string;
  dataFim: string;
  materiaId?: number;
}
