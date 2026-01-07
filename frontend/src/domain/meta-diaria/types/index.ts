/**
 * @module domain/meta-diaria/types
 * @description Type definitions for Meta Diária domain
 */

export interface HorarioPreferencial {
  horarioInicio: string;
  horarioFim: string;
}

export interface MetaDiaria {
  id: number;
  usuarioId: number;
  dataMeta: string;
  tituloMeta: string;
  tempoTotalDesejado: number | null;
  horariosPreferenciais: HorarioPreferencial[];
  materiasSelecionadas: number[];
  topicosEspecificos: string[];
  prioridade: 'alta' | 'media' | 'baixa';
  status: 'ativa' | 'inativa' | 'concluida';
  dataCriacao: string;
}

export interface MetaDiariaListItem {
  id: number;
  dataMeta: string;
  tituloMeta: string;
  prioridade: 'alta' | 'media' | 'baixa';
  status: 'ativa' | 'inativa' | 'concluida';
  totalSessoes: number;
  dataCriacao: string;
}

export interface MetaDiariaDetails extends MetaDiaria {
  sessoes?: SessaoEstudo[];
}

export interface SessaoEstudo {
  id: number;
  metaId: number;
  horarioInicio: string | null;
  horarioFim: string | null;
  duracaoMinutos: number;
  materiaId: number;
  topico: string | null;
}

export interface CreateMetaDiariaDto {
  usuarioId: number;
  dataMeta: string;
  tituloMeta: string;
  tempoTotalDesejado?: number | null;
  horariosPreferenciais: HorarioPreferencial[];
  materiasSelecionadas: number[];
  topicosEspecificos: string[];
  prioridade: 'alta' | 'media' | 'baixa';
}

export interface UpdateMetaDiariaDto {
  tituloMeta: string;
  tempoTotalDesejado?: number | null;
  horariosPreferenciais: HorarioPreferencial[];
  materiasSelecionadas: number[];
  topicosEspecificos: string[];
  prioridade: 'alta' | 'media' | 'baixa';
  status: 'ativa' | 'inativa' | 'concluida';
}

export interface DuplicateMetaDiariaDto {
  dataDestino: string;
}

export interface CreateSessaoEstudoDto {
  metaId: number;
  horarioInicio?: string | null;
  horarioFim?: string | null;
  duracaoMinutos: number;
  materiaId: number;
  topico?: string | null;
}
