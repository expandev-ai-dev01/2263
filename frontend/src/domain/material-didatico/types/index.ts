/**
 * @module domain/material-didatico/types
 * @description Type definitions for Material Didático domain
 */

export interface MaterialDidatico {
  id: number;
  titulo: string;
  editalId: number;
  disciplinaId: number;
  descricao: string | null;
  arquivoPdf: string;
  tags: string[];
  nivelDificuldade: 'basico' | 'intermediario' | 'avancado';
  ordemApresentacao: number;
  status: 'ativo' | 'inativo' | 'processando';
  dataCadastro: string;
  usuarioCadastro: number;
}

export interface MaterialDidaticoListItem {
  id: number;
  titulo: string;
  editalId: number;
  disciplinaId: number;
  nivelDificuldade: 'basico' | 'intermediario' | 'avancado';
  status: 'ativo' | 'inativo' | 'processando';
  dataCadastro: string;
}

export interface MaterialDidaticoDetails extends MaterialDidatico {
  editalNome?: string;
  disciplinaNome?: string;
}

export interface CreateMaterialDidaticoDto {
  titulo: string;
  editalId: number;
  disciplinaId: number;
  descricao?: string | null;
  arquivoPdf: string;
  tags: string[];
  nivelDificuldade: 'basico' | 'intermediario' | 'avancado';
  ordemApresentacao?: number;
  usuarioCadastro: number;
}

export interface UpdateMaterialDidaticoDto {
  titulo: string;
  descricao?: string | null;
  tags: string[];
  nivelDificuldade: 'basico' | 'intermediario' | 'avancado';
  ordemApresentacao: number;
  status: 'ativo' | 'inativo' | 'processando';
}
