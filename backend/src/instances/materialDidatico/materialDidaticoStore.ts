/**
 * @summary
 * In-memory store instance for MaterialDidatico entity.
 * Provides singleton pattern for data storage without database.
 *
 * @module instances/materialDidatico/materialDidaticoStore
 */

import { MATERIAL_DIDATICO_DEFAULTS } from '@/constants';
import { MaterialDidaticoNivel, MaterialDidaticoStatus } from '@/constants';

/**
 * MaterialDidatico record structure
 */
export interface MaterialDidaticoRecord {
  id: number;
  titulo: string;
  editalId: number;
  disciplinaId: number;
  descricao: string | null;
  arquivoPdf: string;
  tags: string[];
  nivelDificuldade: MaterialDidaticoNivel;
  ordemApresentacao: number;
  status: MaterialDidaticoStatus;
  dataCadastro: string;
  usuarioCadastro: number;
}

/**
 * In-memory store for MaterialDidatico records
 */
class MaterialDidaticoStore {
  private records: Map<number, MaterialDidaticoRecord> = new Map();
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
  getAll(): MaterialDidaticoRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Get record by ID
   */
  getById(id: number): MaterialDidaticoRecord | undefined {
    return this.records.get(id);
  }

  /**
   * Get records by edital and disciplina
   */
  getByEditalAndDisciplina(editalId: number, disciplinaId: number): MaterialDidaticoRecord[] {
    return Array.from(this.records.values()).filter(
      (record) => record.editalId === editalId && record.disciplinaId === disciplinaId
    );
  }

  /**
   * Check if titulo exists for edital + disciplina combination
   */
  existsTituloForEditalDisciplina(
    titulo: string,
    editalId: number,
    disciplinaId: number,
    excludeId?: number
  ): boolean {
    return Array.from(this.records.values()).some(
      (record) =>
        record.titulo.toLowerCase() === titulo.toLowerCase() &&
        record.editalId === editalId &&
        record.disciplinaId === disciplinaId &&
        record.id !== excludeId
    );
  }

  /**
   * Get maximum ordem_apresentacao for a disciplina
   */
  getMaxOrdemApresentacao(disciplinaId: number): number {
    const records = Array.from(this.records.values()).filter(
      (record) => record.disciplinaId === disciplinaId
    );
    if (records.length === 0) return 0;
    return Math.max(...records.map((r) => r.ordemApresentacao));
  }

  /**
   * Add new record
   */
  add(record: MaterialDidaticoRecord): MaterialDidaticoRecord {
    this.records.set(record.id, record);
    return record;
  }

  /**
   * Update existing record
   */
  update(id: number, data: Partial<MaterialDidaticoRecord>): MaterialDidaticoRecord | undefined {
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
 * Singleton instance of MaterialDidaticoStore
 */
export const materialDidaticoStore = new MaterialDidaticoStore();
