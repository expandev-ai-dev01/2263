/**
 * @service DisciplinaService
 * @domain disciplina
 * @type REST API Service
 * @description Service for managing Disciplina operations
 */

import { authenticatedClient } from '@/core/lib/api';
import type {
  Disciplina,
  DisciplinaListItem,
  CreateDisciplinaDto,
  UpdateDisciplinaDto,
  MoveDisciplinaDto,
  DeleteDisciplinaDto,
} from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const disciplinaService = {
  /**
   * List all disciplinas
   */
  async list(): Promise<DisciplinaListItem[]> {
    const { data } = await authenticatedClient.get<ApiResponse<DisciplinaListItem[]>>(
      '/disciplina'
    );
    return data.data;
  },

  /**
   * Get disciplina by ID
   */
  async getById(id: string): Promise<Disciplina> {
    const { data } = await authenticatedClient.get<ApiResponse<Disciplina>>(`/disciplina/${id}`);
    return data.data;
  },

  /**
   * Create new disciplina
   */
  async create(dto: CreateDisciplinaDto): Promise<Disciplina> {
    const { data } = await authenticatedClient.post<ApiResponse<Disciplina>>('/disciplina', dto);
    return data.data;
  },

  /**
   * Update existing disciplina
   */
  async update(id: string, dto: UpdateDisciplinaDto): Promise<Disciplina> {
    const { data } = await authenticatedClient.put<ApiResponse<Disciplina>>(
      `/disciplina/${id}`,
      dto
    );
    return data.data;
  },

  /**
   * Delete disciplina
   */
  async delete(id: string, dto: DeleteDisciplinaDto): Promise<{ message: string }> {
    const { data } = await authenticatedClient.delete<ApiResponse<{ message: string }>>(
      `/disciplina/${id}`,
      { data: dto }
    );
    return data.data;
  },

  /**
   * Move disciplina in hierarchy
   */
  async move(id: string, dto: MoveDisciplinaDto): Promise<Disciplina> {
    const { data } = await authenticatedClient.put<ApiResponse<Disciplina>>(
      `/disciplina/${id}/move`,
      dto
    );
    return data.data;
  },
};
