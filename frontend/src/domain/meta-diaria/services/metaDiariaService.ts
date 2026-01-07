/**
 * @service MetaDiariaService
 * @domain meta-diaria
 * @type REST API Service
 * @description Service for managing Meta Diária operations
 */

import { authenticatedClient } from '@/core/lib/api';
import type {
  MetaDiaria,
  MetaDiariaListItem,
  CreateMetaDiariaDto,
  UpdateMetaDiariaDto,
  DuplicateMetaDiariaDto,
} from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface MetaDiariaListParams {
  usuarioId?: number;
  dataMeta?: string;
  status?: 'ativa' | 'inativa' | 'concluida' | 'todas';
}

export const metaDiariaService = {
  /**
   * List metas diárias with optional filters
   */
  async list(params?: MetaDiariaListParams): Promise<MetaDiariaListItem[]> {
    const { data } = await authenticatedClient.get<ApiResponse<MetaDiariaListItem[]>>(
      '/meta-diaria',
      { params }
    );
    return data.data;
  },

  /**
   * Get meta diária by ID
   */
  async getById(id: number): Promise<MetaDiaria> {
    const { data } = await authenticatedClient.get<ApiResponse<MetaDiaria>>(`/meta-diaria/${id}`);
    return data.data;
  },

  /**
   * Create new meta diária
   */
  async create(dto: CreateMetaDiariaDto): Promise<MetaDiaria> {
    const { data } = await authenticatedClient.post<ApiResponse<MetaDiaria>>('/meta-diaria', dto);
    return data.data;
  },

  /**
   * Update existing meta diária
   */
  async update(id: number, dto: UpdateMetaDiariaDto): Promise<MetaDiaria> {
    const { data } = await authenticatedClient.put<ApiResponse<MetaDiaria>>(
      `/meta-diaria/${id}`,
      dto
    );
    return data.data;
  },

  /**
   * Delete meta diária
   */
  async delete(id: number): Promise<{ message: string }> {
    const { data } = await authenticatedClient.delete<ApiResponse<{ message: string }>>(
      `/meta-diaria/${id}`
    );
    return data.data;
  },

  /**
   * Duplicate meta diária to another date
   */
  async duplicate(id: number, dto: DuplicateMetaDiariaDto): Promise<MetaDiaria> {
    const { data } = await authenticatedClient.post<ApiResponse<MetaDiaria>>(
      `/meta-diaria/${id}/duplicate`,
      dto
    );
    return data.data;
  },
};
