/**
 * @summary
 * In-memory store instance for Disciplina entity.
 * Provides singleton pattern for data storage without database.
 *
 * @module instances/disciplina/disciplinaStore
 */

import { DISCIPLINA_DEFAULTS } from '@/constants';

/**
 * Disciplina record structure
 */
export interface DisciplinaRecord {
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

/**
 * In-memory store for Disciplina records
 */
class DisciplinaStore {
  private records: Map<string, DisciplinaRecord> = new Map();
  private currentId: number = 0;

  /**
   * Get next available ID (UUID-like format)
   */
  getNextId(): string {
    this.currentId += 1;
    return `disc-${this.currentId.toString().padStart(8, '0')}`;
  }

  /**
   * Get all records
   */
  getAll(): DisciplinaRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Get record by ID
   */
  getById(id: string): DisciplinaRecord | undefined {
    return this.records.get(id);
  }

  /**
   * Get records by parent ID
   */
  getByParentId(parentId: string | null): DisciplinaRecord[] {
    return Array.from(this.records.values()).filter(
      (record) => record.disciplinaPaiId === parentId
    );
  }

  /**
   * Check if name exists at same hierarchy level
   */
  existsNameAtLevel(nome: string, parentId: string | null, excludeId?: string): boolean {
    return Array.from(this.records.values()).some(
      (record) =>
        record.nomeDisciplina.toLowerCase() === nome.toLowerCase() &&
        record.disciplinaPaiId === parentId &&
        record.id !== excludeId
    );
  }

  /**
   * Get hierarchy depth for a disciplina
   */
  getHierarchyDepth(id: string): number {
    let depth = 1;
    let current = this.records.get(id);

    while (current?.disciplinaPaiId) {
      depth++;
      current = this.records.get(current.disciplinaPaiId);
      if (depth > 10) break; // Safety limit
    }

    return depth;
  }

  /**
   * Check if disciplina has active subdisciplinas
   */
  hasActiveSubdisciplinas(id: string): boolean {
    return Array.from(this.records.values()).some(
      (record) => record.disciplinaPaiId === id && record.ativa
    );
  }

  /**
   * Check if moving would create circular reference
   */
  wouldCreateCircularReference(id: string, newParentId: string | null): boolean {
    if (!newParentId) return false;
    if (id === newParentId) return true;

    let current = this.records.get(newParentId);
    const visited = new Set<string>();

    while (current) {
      if (current.id === id) return true;
      if (visited.has(current.id)) return true;
      visited.add(current.id);
      current = current.disciplinaPaiId ? this.records.get(current.disciplinaPaiId) : undefined;
    }

    return false;
  }

  /**
   * Add new record
   */
  add(record: DisciplinaRecord): DisciplinaRecord {
    this.records.set(record.id, record);
    return record;
  }

  /**
   * Update existing record
   */
  update(id: string, data: Partial<DisciplinaRecord>): DisciplinaRecord | undefined {
    const existing = this.records.get(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, ...data, dataAtualizacao: new Date().toISOString() };
    this.records.set(id, updated);
    return updated;
  }

  /**
   * Delete record by ID
   */
  delete(id: string): boolean {
    return this.records.delete(id);
  }

  /**
   * Check if record exists
   */
  exists(id: string): boolean {
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
 * Singleton instance of DisciplinaStore
 */
export const disciplinaStore = new DisciplinaStore();
