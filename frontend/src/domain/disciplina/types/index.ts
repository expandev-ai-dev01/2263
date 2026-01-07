/**
 * @module domain/disciplina/types
 * @description Type definitions for Disciplina domain
 */

export interface Disciplina {
  id: string;
  nomeDisciplina: string;
  descricao: string | null;
  disciplinaPaiId: string | null;
  ordemExibicao: number;
  ativa: boolean;
  possuiSubdisciplinas: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface DisciplinaListItem {
  id: string;
  nomeDisciplina: string;
  disciplinaPaiId: string | null;
  ordemExibicao: number;
  ativa: boolean;
  possuiSubdisciplinas: boolean;
  dataCriacao: string;
}

export interface DisciplinaDetails extends Disciplina {
  subdisciplinas?: DisciplinaListItem[];
  disciplinaPai?: {
    id: string;
    nomeDisciplina: string;
  };
}

export interface CreateDisciplinaDto {
  nomeDisciplina: string;
  descricao?: string | null;
  disciplinaPaiId?: string | null;
  ordemExibicao: number;
  ativa: boolean;
}

export interface UpdateDisciplinaDto {
  nomeDisciplina: string;
  descricao?: string | null;
  ordemExibicao: number;
  ativa: boolean;
}

export interface MoveDisciplinaDto {
  novoPaiId: string | null;
  novaPosicao: number;
}

export interface DeleteDisciplinaDto {
  confirmacaoExclusao: boolean;
  motivoExclusao?: string | null;
}
