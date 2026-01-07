/**
 * @summary
 * In-memory store instance for MetaDiaria entity.
 * Provides singleton pattern for data storage without database.
 *
 * @module instances/metaDiaria/metaDiariaStore
 */

import { MetaDiariaPrioridade, MetaDiariaStatus } from '@/constants';
import { HorarioPreferencial } from '@/services/metaDiaria/metaDiariaTypes';

/**
 * MetaDiaria record structure
 */
export interface MetaDiariaRecord {
  id: number;
  usuarioId: number;
  dataMeta: string;
  tituloMeta: string;
  tempoTotalDesejado: number | null;
  horariosPreferenciais: HorarioPreferencial[];
  materiasSelecionadas: number[];
  topicosEspecificos: string[];
  prioridade: MetaDiariaPrioridade;
  status: MetaDiariaStatus;
  dataCriacao: string;
}

/**
 * In-memory store for MetaDiaria records
 */
class MetaDiariaStore {
  private records: Map<number, MetaDiariaRecord> = new Map();
  private currentId: number = 0;

  /**
   * Get next available ID
   */
  getNextId(): number {
    this.currentId += 1;
    return this.currentId;
  }

  /**
   * Get all records
   */
  getAll(): MetaDiariaRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Get record by ID
   */
  getById(id: number): MetaDiariaRecord | undefined {
    return this.records.get(id);
  }

  /**
   * Get records by user ID
   */
  getByUsuarioId(usuarioId: number): MetaDiariaRecord[] {
    return Array.from(this.records.values()).filter((record) => record.usuarioId === usuarioId);
  }

  /**
   * Get records by user ID and date
   */
  getByUsuarioIdAndDate(usuarioId: number, dataMeta: string): MetaDiariaRecord[] {
    return Array.from(this.records.values()).filter(
      (record) => record.usuarioId === usuarioId && record.dataMeta === dataMeta
    );
  }

  /**
   * Get records by user ID, date, and status
   */
  getByUsuarioIdDateAndStatus(
    usuarioId: number,
    dataMeta?: string,
    status?: MetaDiariaStatus
  ): MetaDiariaRecord[] {
    return Array.from(this.records.values()).filter((record) => {
      if (record.usuarioId !== usuarioId) return false;
      if (dataMeta && record.dataMeta !== dataMeta) return false;
      if (status && record.status !== status) return false;
      return true;
    });
  }

  /**
   * Add new record
   */
  add(record: MetaDiariaRecord): MetaDiariaRecord {
    this.records.set(record.id, record);
    return record;
  }

  /**
   * Update existing record
   */
  update(id: number, data: Partial<MetaDiariaRecord>): MetaDiariaRecord | undefined {
    const existing = this.records.get(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, ...data };
    this.records.set(id, updated);
    return updated;
  }

  /**
   * Delete record by ID
   */
  delete(id: number): boolean {
    return this.records.delete(id);
  }

  /**
   * Check if record exists
   */
  exists(id: number): boolean {
    return this.records.has(id);
  }

  /**
   * Get total count of records
   */
  count(): number {
    return this.records.size;
  }

  /**
   * Clear all records (useful for testing)
   */
  clear(): void {
    this.records.clear();
    this.currentId = 0;
  }
}

/**
 * Singleton instance of MetaDiariaStore
 */
export const metaDiariaStore = new MetaDiariaStore();
