/**
 * @service MaterialDidaticoService
 * @domain material-didatico
 * @type REST API Service
 * @description Service for managing Material Didático operations
 */

import { authenticatedClient } from '@/core/lib/api';
import type {
  MaterialDidatico,
  MaterialDidaticoListItem,
  CreateMaterialDidaticoDto,
  UpdateMaterialDidaticoDto,
} from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const materialDidaticoService = {
  /**
   * List all materiais didáticos
   */
  async list(): Promise<MaterialDidaticoListItem[]> {
    const { data } = await authenticatedClient.get<ApiResponse<MaterialDidaticoListItem[]>>(
      '/material-didatico'
    );
    return data.data;
  },

  /**
   * Get material didático by ID
   */
  async getById(id: number): Promise<MaterialDidatico> {
    const { data } = await authenticatedClient.get<ApiResponse<MaterialDidatico>>(
      `/material-didatico/${id}`
    );
    return data.data;
  },

  /**
   * Create new material didático
   */
  async create(dto: CreateMaterialDidaticoDto): Promise<MaterialDidatico> {
    const { data } = await authenticatedClient.post<ApiResponse<MaterialDidatico>>(
      '/material-didatico',
      dto
    );
    return data.data;
  },

  /**
   * Update existing material didático
   */
  async update(id: number, dto: UpdateMaterialDidaticoDto): Promise<MaterialDidatico> {
    const { data } = await authenticatedClient.put<ApiResponse<MaterialDidatico>>(
      `/material-didatico/${id}`,
      dto
    );
    return data.data;
  },

  /**
   * Delete material didático
   */
  async delete(id: number): Promise<{ message: string }> {
    const { data } = await authenticatedClient.delete<ApiResponse<{ message: string }>>(
      `/material-didatico/${id}`
    );
    return data.data;
  },
};
