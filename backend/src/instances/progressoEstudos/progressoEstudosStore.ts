/**
 * @summary
 * In-memory store instance for ProgressoEstudos entity.
 * Provides singleton pattern for data storage without database.
 *
 * @module instances/progressoEstudos/progressoEstudosStore
 */

import { PROGRESSO_ESTUDOS_DEFAULTS } from '@/constants';

/**
 * ConteudoConcluido record structure
 */
export interface ConteudoConcluidoRecord {
  id: number;
  usuarioId: number;
  conteudoId: number;
  dataConclusao: string;
}

/**
 * SessaoEstudo record structure
 */
export interface SessaoEstudoRecord {
  id: number;
  usuarioId: number;
  dataInicio: string;
  dataFim: string;
  duracaoMinutos: number;
  materiaId?: number;
  disciplinaId?: number;
}

/**
 * PreferenciasNotificacao record structure
 */
export interface PreferenciasNotificacaoRecord {
  usuarioId: number;
  notificacaoPushHabilitada: boolean;
  notificacaoEmailHabilitada: boolean;
  notificacaoSmsHabilitada: boolean;
  tiposMarcoHabilitados: string[];
}

/**
 * NotificacaoMarco record structure
 */
export interface NotificacaoMarcoRecord {
  id: number;
  usuarioId: number;
  tipoMarco: string;
  descricaoMarco: string;
  dataMarco: string;
  notificacaoEnviada: boolean;
  canaisNotificacao: string[];
  tentativasEnvio: number;
  statusEnvioPorCanal: { [canal: string]: string };
}

/**
 * In-memory store for ProgressoEstudos records
 */
class ProgressoEstudosStore {
  private conteudosConcluidos: Map<number, ConteudoConcluidoRecord> = new Map();
  private sessoesEstudo: Map<number, SessaoEstudoRecord> = new Map();
  private preferenciasNotificacao: Map<number, PreferenciasNotificacaoRecord> = new Map();
  private notificacoesMarco: Map<number, NotificacaoMarcoRecord> = new Map();
  private currentConteudoId: number = 0;
  private currentSessaoId: number = 0;
  private currentNotificacaoId: number = 0;

  /**
   * Get next available conteudo ID
   */
  getNextConteudoId(): number {
    this.currentConteudoId += 1;
    return this.currentConteudoId;
  }

  /**
   * Get next available sessao ID
   */
  getNextSessaoId(): number {
    this.currentSessaoId += 1;
    return this.currentSessaoId;
  }

  /**
   * Get next available notificacao ID
   */
  getNextNotificacaoId(): number {
    this.currentNotificacaoId += 1;
    return this.currentNotificacaoId;
  }

  /**
   * Add conteudo concluido
   */
  addConteudoConcluido(record: ConteudoConcluidoRecord): ConteudoConcluidoRecord {
    this.conteudosConcluidos.set(record.id, record);
    return record;
  }

  /**
   * Get conteudos concluidos by user
   */
  getConteudosConcluidosByUsuario(usuarioId: number): ConteudoConcluidoRecord[] {
    return Array.from(this.conteudosConcluidos.values()).filter((c) => c.usuarioId === usuarioId);
  }

  /**
   * Add sessao estudo
   */
  addSessaoEstudo(record: SessaoEstudoRecord): SessaoEstudoRecord {
    this.sessoesEstudo.set(record.id, record);
    return record;
  }

  /**
   * Get sessoes estudo by user
   */
  getSessoesEstudoByUsuario(usuarioId: number): SessaoEstudoRecord[] {
    return Array.from(this.sessoesEstudo.values()).filter((s) => s.usuarioId === usuarioId);
  }

  /**
   * Get sessoes estudo by user and date range
   */
  getSessoesEstudoByUsuarioAndDateRange(
    usuarioId: number,
    dataInicio: string,
    dataFim: string
  ): SessaoEstudoRecord[] {
    return Array.from(this.sessoesEstudo.values()).filter(
      (s) => s.usuarioId === usuarioId && s.dataInicio >= dataInicio && s.dataInicio <= dataFim
    );
  }

  /**
   * Set preferencias notificacao
   */
  setPreferenciasNotificacao(record: PreferenciasNotificacaoRecord): PreferenciasNotificacaoRecord {
    this.preferenciasNotificacao.set(record.usuarioId, record);
    return record;
  }

  /**
   * Get preferencias notificacao by user
   */
  getPreferenciasNotificacao(usuarioId: number): PreferenciasNotificacaoRecord | undefined {
    return this.preferenciasNotificacao.get(usuarioId);
  }

  /**
   * Add notificacao marco
   */
  addNotificacaoMarco(record: NotificacaoMarcoRecord): NotificacaoMarcoRecord {
    this.notificacoesMarco.set(record.id, record);
    return record;
  }

  /**
   * Get notificacoes marco by user
   */
  getNotificacoesMarcoByUsuario(usuarioId: number): NotificacaoMarcoRecord[] {
    return Array.from(this.notificacoesMarco.values()).filter((n) => n.usuarioId === usuarioId);
  }

  /**
   * Update notificacao marco
   */
  updateNotificacaoMarco(
    id: number,
    data: Partial<NotificacaoMarcoRecord>
  ): NotificacaoMarcoRecord | undefined {
    const existing = this.notificacoesMarco.get(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, ...data };
    this.notificacoesMarco.set(id, updated);
    return updated;
  }

  /**
   * Clear all records (useful for testing)
   */
  clear(): void {
    this.conteudosConcluidos.clear();
    this.sessoesEstudo.clear();
    this.preferenciasNotificacao.clear();
    this.notificacoesMarco.clear();
    this.currentConteudoId = 0;
    this.currentSessaoId = 0;
    this.currentNotificacaoId = 0;
  }
}

/**
 * Singleton instance of ProgressoEstudosStore
 */
export const progressoEstudosStore = new ProgressoEstudosStore();
