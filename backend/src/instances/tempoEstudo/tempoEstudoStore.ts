/**
 * @summary
 * In-memory store instance for TempoEstudo entity.
 * Provides singleton pattern for data storage without database.
 *
 * @module instances/tempoEstudo/tempoEstudoStore
 */

import { StatusSessao, MotivoInterrupcao } from '@/constants';

/**
 * SessaoEstudo record structure
 */
export interface SessaoEstudoRecord {
  id: number;
  usuarioId: number;
  materiaId: number;
  dataHoraInicio: string;
  dataHoraFim: string | null;
  status: StatusSessao;
  duracaoTotalMinutos: number | null;
  motivoInterrupcao: MotivoInterrupcao | null;
}

/**
 * Pausa record structure
 */
export interface PausaRecord {
  id: number;
  sessaoId: number;
  dataHoraInicio: string;
  dataHoraFim: string | null;
  duracaoMinutos: number | null;
}

/**
 * RegistroManual record structure
 */
export interface RegistroManualRecord {
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

/**
 * In-memory store for TempoEstudo records
 */
class TempoEstudoStore {
  private sessoes: Map<number, SessaoEstudoRecord> = new Map();
  private pausas: Map<number, PausaRecord> = new Map();
  private registrosManuais: Map<number, RegistroManualRecord> = new Map();
  private currentSessaoId: number = 0;
  private currentPausaId: number = 0;
  private currentRegistroId: number = 0;

  /**
   * Get next available sessao ID
   */
  getNextSessaoId(): number {
    this.currentSessaoId += 1;
    return this.currentSessaoId;
  }

  /**
   * Get next available pausa ID
   */
  getNextPausaId(): number {
    this.currentPausaId += 1;
    return this.currentPausaId;
  }

  /**
   * Get next available registro ID
   */
  getNextRegistroId(): number {
    this.currentRegistroId += 1;
    return this.currentRegistroId;
  }

  /**
   * Add new sessao
   */
  addSessao(record: SessaoEstudoRecord): SessaoEstudoRecord {
    this.sessoes.set(record.id, record);
    return record;
  }

  /**
   * Get sessao by ID
   */
  getSessaoById(id: number): SessaoEstudoRecord | undefined {
    return this.sessoes.get(id);
  }

  /**
   * Get active sessao by user
   */
  getActiveSessaoByUsuario(usuarioId: number): SessaoEstudoRecord | undefined {
    return Array.from(this.sessoes.values()).find(
      (s) => s.usuarioId === usuarioId && (s.status === 'active' || s.status === 'paused')
    );
  }

  /**
   * Get all sessoes by user
   */
  getSessoesByUsuario(usuarioId: number): SessaoEstudoRecord[] {
    return Array.from(this.sessoes.values()).filter((s) => s.usuarioId === usuarioId);
  }

  /**
   * Update sessao
   */
  updateSessao(id: number, data: Partial<SessaoEstudoRecord>): SessaoEstudoRecord | undefined {
    const existing = this.sessoes.get(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, ...data };
    this.sessoes.set(id, updated);
    return updated;
  }

  /**
   * Add new pausa
   */
  addPausa(record: PausaRecord): PausaRecord {
    this.pausas.set(record.id, record);
    return record;
  }

  /**
   * Get pausas by sessao
   */
  getPausasBySessao(sessaoId: number): PausaRecord[] {
    return Array.from(this.pausas.values()).filter((p) => p.sessaoId === sessaoId);
  }

  /**
   * Get active pausa by sessao
   */
  getActivePausaBySessao(sessaoId: number): PausaRecord | undefined {
    return Array.from(this.pausas.values()).find(
      (p) => p.sessaoId === sessaoId && p.dataHoraFim === null
    );
  }

  /**
   * Update pausa
   */
  updatePausa(id: number, data: Partial<PausaRecord>): PausaRecord | undefined {
    const existing = this.pausas.get(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, ...data };
    this.pausas.set(id, updated);
    return updated;
  }

  /**
   * Add new registro manual
   */
  addRegistroManual(record: RegistroManualRecord): RegistroManualRecord {
    this.registrosManuais.set(record.id, record);
    return record;
  }

  /**
   * Get registro manual by ID
   */
  getRegistroManualById(id: number): RegistroManualRecord | undefined {
    return this.registrosManuais.get(id);
  }

  /**
   * Get registros manuais by user
   */
  getRegistrosManuaisByUsuario(usuarioId: number): RegistroManualRecord[] {
    return Array.from(this.registrosManuais.values()).filter((r) => r.usuarioId === usuarioId);
  }

  /**
   * Update registro manual
   */
  updateRegistroManual(
    id: number,
    data: Partial<RegistroManualRecord>
  ): RegistroManualRecord | undefined {
    const existing = this.registrosManuais.get(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, ...data };
    this.registrosManuais.set(id, updated);
    return updated;
  }

  /**
   * Delete registro manual
   */
  deleteRegistroManual(id: number): boolean {
    return this.registrosManuais.delete(id);
  }

  /**
   * Check for time overlap
   */
  hasTimeOverlap(
    usuarioId: number,
    dataEstudo: string,
    horarioInicio: string,
    horarioFim: string,
    excludeRegistroId?: number
  ): boolean {
    const registros = Array.from(this.registrosManuais.values()).filter(
      (r) => r.usuarioId === usuarioId && r.dataEstudo === dataEstudo && r.id !== excludeRegistroId
    );

    const sessoes = Array.from(this.sessoes.values()).filter(
      (s) =>
        s.usuarioId === usuarioId &&
        s.dataHoraInicio.startsWith(dataEstudo) &&
        (s.status === 'active' || s.status === 'paused')
    );

    const newStart = `${dataEstudo}T${horarioInicio}:00`;
    const newEnd = `${dataEstudo}T${horarioFim}:00`;

    for (const registro of registros) {
      const existingStart = `${registro.dataEstudo}T${registro.horarioInicio}:00`;
      const existingEnd = `${registro.dataEstudo}T${registro.horarioFim}:00`;

      if (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      ) {
        return true;
      }
    }

    for (const sessao of sessoes) {
      const existingStart = sessao.dataHoraInicio;
      const existingEnd = sessao.dataHoraFim || new Date().toISOString();

      if (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get total study time for date
   */
  getTotalStudyTimeForDate(usuarioId: number, dataEstudo: string): number {
    const registros = Array.from(this.registrosManuais.values()).filter(
      (r) => r.usuarioId === usuarioId && r.dataEstudo === dataEstudo
    );

    const sessoes = Array.from(this.sessoes.values()).filter(
      (s) =>
        s.usuarioId === usuarioId &&
        s.dataHoraInicio.startsWith(dataEstudo) &&
        s.status === 'completed' &&
        s.duracaoTotalMinutos !== null
    );

    const totalRegistros = registros.reduce((sum, r) => sum + r.duracaoMinutos, 0);
    const totalSessoes = sessoes.reduce((sum, s) => sum + (s.duracaoTotalMinutos || 0), 0);

    return totalRegistros + totalSessoes;
  }

  /**
   * Clear all records (useful for testing)
   */
  clear(): void {
    this.sessoes.clear();
    this.pausas.clear();
    this.registrosManuais.clear();
    this.currentSessaoId = 0;
    this.currentPausaId = 0;
    this.currentRegistroId = 0;
  }
}

/**
 * Singleton instance of TempoEstudoStore
 */
export const tempoEstudoStore = new TempoEstudoStore();
