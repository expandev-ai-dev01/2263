/**
 * @summary
 * Business logic for TempoEstudo entity.
 * Handles study time tracking operations using in-memory storage.
 * All validation and business logic is centralized here.
 *
 * @module services/tempoEstudo/tempoEstudoService
 */

import { TEMPO_ESTUDO_DEFAULTS, STATUS_SESSAO } from '@/constants';
import { tempoEstudoStore } from '@/instances';
import { ServiceError } from '@/utils';
import {
  SessaoEstudoEntity,
  RegistroManualEntity,
  HistoricoSessaoItem,
  EstatisticasTempoResponse,
} from './tempoEstudoTypes';
import {
  iniciarSessaoSchema,
  finalizarSessaoSchema,
  pausarSessaoSchema,
  retomarSessaoSchema,
  criarRegistroManualSchema,
  atualizarRegistroManualSchema,
  editarSessaoAutomaticaSchema,
  historicoSessoesSchema,
  estatisticasTempoSchema,
  paramsSchema,
} from './tempoEstudoValidation';

/**
 * Helper function to format minutes to HH:MM
 */
function formatMinutesToHHMM(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Helper function to calculate duration in minutes
 */
function calculateDurationMinutes(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60));
}

/**
 * @summary
 * Starts a new study session.
 *
 * @function sessaoIniciar
 * @module services/tempoEstudo
 *
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<SessaoEstudoEntity>} The newly created session
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 * @throws {ServiceError} ACTIVE_SESSION_EXISTS (400) - When user already has an active session
 */
export async function sessaoIniciar(body: unknown): Promise<SessaoEstudoEntity> {
  const validation = iniciarSessaoSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const { usuarioId, materiaId } = validation.data;

  /**
   * @rule {BR-001}
   * Check for existing active session
   */
  const activeSessao = tempoEstudoStore.getActiveSessaoByUsuario(usuarioId);
  if (activeSessao) {
    throw new ServiceError(
      'ACTIVE_SESSION_EXISTS',
      'Você já possui uma sessão de estudo ativa. Finalize ou pause antes de iniciar nova sessão',
      400
    );
  }

  const now = new Date().toISOString();
  const id = tempoEstudoStore.getNextSessaoId();

  const newSessao: SessaoEstudoEntity = {
    id,
    usuarioId,
    materiaId,
    dataHoraInicio: now,
    dataHoraFim: null,
    status: STATUS_SESSAO.ACTIVE,
    duracaoTotalMinutos: null,
    motivoInterrupcao: null,
  };

  tempoEstudoStore.addSessao(newSessao);
  return newSessao;
}

/**
 * @summary
 * Finishes an active study session.
 *
 * @function sessaoFinalizar
 * @module services/tempoEstudo
 *
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<SessaoEstudoEntity>} The finished session
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 * @throws {ServiceError} NOT_FOUND (404) - When session does not exist
 * @throws {ServiceError} INVALID_STATUS (400) - When session is not active
 * @throws {ServiceError} SESSION_TOO_SHORT (400) - When session duration is less than 1 minute
 */
export async function sessaoFinalizar(body: unknown): Promise<SessaoEstudoEntity> {
  const validation = finalizarSessaoSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const { sessaoId } = validation.data;
  const sessao = tempoEstudoStore.getSessaoById(sessaoId);

  if (!sessao) {
    throw new ServiceError('NOT_FOUND', 'Sessão não encontrada', 404);
  }

  if (sessao.status !== STATUS_SESSAO.ACTIVE) {
    throw new ServiceError('INVALID_STATUS', 'Apenas sessões ativas podem ser finalizadas', 400);
  }

  const now = new Date().toISOString();
  const totalMinutes = calculateDurationMinutes(sessao.dataHoraInicio, now);

  // Subtract pause time
  const pausas = tempoEstudoStore.getPausasBySessao(sessaoId);
  const totalPauseMinutes = pausas.reduce((sum, p) => sum + (p.duracaoMinutos || 0), 0);
  const effectiveMinutes = totalMinutes - totalPauseMinutes;

  /**
   * @rule {BR-006}
   * Check minimum session duration
   */
  if (effectiveMinutes < TEMPO_ESTUDO_DEFAULTS.TEMPO_MINIMO_SESSAO) {
    throw new ServiceError(
      'SESSION_TOO_SHORT',
      'Sessão deve ter pelo menos 1 minuto para ser considerada válida',
      400
    );
  }

  const updated = tempoEstudoStore.updateSessao(sessaoId, {
    dataHoraFim: now,
    status: STATUS_SESSAO.COMPLETED,
    duracaoTotalMinutos: effectiveMinutes,
  });

  return updated as SessaoEstudoEntity;
}

/**
 * @summary
 * Pauses an active study session.
 *
 * @function sessaoPausar
 * @module services/tempoEstudo
 *
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<SessaoEstudoEntity>} The paused session
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 * @throws {ServiceError} NOT_FOUND (404) - When session does not exist
 * @throws {ServiceError} INVALID_STATUS (400) - When session is not active
 */
export async function sessaoPausar(body: unknown): Promise<SessaoEstudoEntity> {
  const validation = pausarSessaoSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const { sessaoId } = validation.data;
  const sessao = tempoEstudoStore.getSessaoById(sessaoId);

  if (!sessao) {
    throw new ServiceError('NOT_FOUND', 'Sessão não encontrada', 404);
  }

  if (sessao.status !== STATUS_SESSAO.ACTIVE) {
    throw new ServiceError(
      'INVALID_STATUS',
      'Não é possível pausar uma sessão que não está ativa',
      400
    );
  }

  const now = new Date().toISOString();
  const pausaId = tempoEstudoStore.getNextPausaId();

  tempoEstudoStore.addPausa({
    id: pausaId,
    sessaoId,
    dataHoraInicio: now,
    dataHoraFim: null,
    duracaoMinutos: null,
  });

  const updated = tempoEstudoStore.updateSessao(sessaoId, {
    status: STATUS_SESSAO.PAUSED,
  });

  return updated as SessaoEstudoEntity;
}

/**
 * @summary
 * Resumes a paused study session.
 *
 * @function sessaoRetomar
 * @module services/tempoEstudo
 *
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<SessaoEstudoEntity>} The resumed session
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 * @throws {ServiceError} NOT_FOUND (404) - When session does not exist
 * @throws {ServiceError} INVALID_STATUS (400) - When session is not paused
 */
export async function sessaoRetomar(body: unknown): Promise<SessaoEstudoEntity> {
  const validation = retomarSessaoSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const { sessaoId } = validation.data;
  const sessao = tempoEstudoStore.getSessaoById(sessaoId);

  if (!sessao) {
    throw new ServiceError('NOT_FOUND', 'Sessão não encontrada', 404);
  }

  if (sessao.status !== STATUS_SESSAO.PAUSED) {
    throw new ServiceError(
      'INVALID_STATUS',
      'Não é possível retomar uma sessão que não está pausada',
      400
    );
  }

  const now = new Date().toISOString();
  const activePausa = tempoEstudoStore.getActivePausaBySessao(sessaoId);

  if (activePausa) {
    const pauseDuration = calculateDurationMinutes(activePausa.dataHoraInicio, now);

    /**
     * @rule {BR-008}
     * Check if pause exceeded 24 hours
     */
    if (pauseDuration > TEMPO_ESTUDO_DEFAULTS.TEMPO_MAXIMO_PAUSA) {
      tempoEstudoStore.updatePausa(activePausa.id, {
        dataHoraFim: now,
        duracaoMinutos: pauseDuration,
      });

      tempoEstudoStore.updateSessao(sessaoId, {
        status: STATUS_SESSAO.INTERRUPTED,
        dataHoraFim: now,
        motivoInterrupcao: 'timeout',
      });

      throw new ServiceError(
        'PAUSE_TIMEOUT',
        'Sessão pausada por mais de 24 horas foi finalizada automaticamente',
        400
      );
    }

    tempoEstudoStore.updatePausa(activePausa.id, {
      dataHoraFim: now,
      duracaoMinutos: pauseDuration,
    });
  }

  const updated = tempoEstudoStore.updateSessao(sessaoId, {
    status: STATUS_SESSAO.ACTIVE,
  });

  return updated as SessaoEstudoEntity;
}

/**
 * @summary
 * Creates a manual study time record.
 *
 * @function registroManualCriar
 * @module services/tempoEstudo
 *
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<RegistroManualEntity>} The created manual record
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 * @throws {ServiceError} TIME_OVERLAP (400) - When time overlaps with existing records
 * @throws {ServiceError} DAILY_LIMIT_EXCEEDED (400) - When daily study limit is exceeded
 */
export async function registroManualCriar(body: unknown): Promise<RegistroManualEntity> {
  const validation = criarRegistroManualSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const { usuarioId, materiaId, dataEstudo, horarioInicio, horarioFim, descricao } =
    validation.data;

  /**
   * @rule {BR-013}
   * Check for time overlap
   */
  if (tempoEstudoStore.hasTimeOverlap(usuarioId, dataEstudo, horarioInicio, horarioFim)) {
    throw new ServiceError(
      'TIME_OVERLAP',
      'Já existe um registro de estudo ou sessão ativa neste horário',
      400
    );
  }

  const [startHour, startMin] = horarioInicio.split(':').map(Number);
  const [endHour, endMin] = horarioFim.split(':').map(Number);
  const duracaoMinutos = endHour * 60 + endMin - (startHour * 60 + startMin);

  /**
   * @rule {BR-011}
   * Check daily study limit
   */
  const totalToday = tempoEstudoStore.getTotalStudyTimeForDate(usuarioId, dataEstudo);
  if (totalToday + duracaoMinutos > TEMPO_ESTUDO_DEFAULTS.LIMITE_HORAS_DIA * 60) {
    throw new ServiceError(
      'DAILY_LIMIT_EXCEEDED',
      'Você já registrou o limite máximo de 12 horas para este dia',
      400
    );
  }

  const now = new Date().toISOString();
  const id = tempoEstudoStore.getNextRegistroId();

  const newRegistro: RegistroManualEntity = {
    id,
    usuarioId,
    materiaId,
    dataEstudo,
    horarioInicio,
    horarioFim,
    duracaoMinutos,
    descricao,
    dataCriacao: now,
    dataAtualizacao: null,
  };

  tempoEstudoStore.addRegistroManual(newRegistro);
  return newRegistro;
}

/**
 * @summary
 * Updates a manual study time record.
 *
 * @function registroManualAtualizar
 * @module services/tempoEstudo
 *
 * @param {unknown} params - Raw request params containing the ID
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<RegistroManualEntity>} The updated manual record
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When params or body fails validation
 * @throws {ServiceError} NOT_FOUND (404) - When record does not exist
 * @throws {ServiceError} EDIT_PERIOD_EXPIRED (400) - When edit period has expired
 * @throws {ServiceError} TIME_OVERLAP (400) - When time overlaps with existing records
 */
export async function registroManualAtualizar(
  params: unknown,
  body: unknown
): Promise<RegistroManualEntity> {
  const paramsValidation = paramsSchema.safeParse(params);

  if (!paramsValidation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, paramsValidation.error.errors);
  }

  const bodyValidation = atualizarRegistroManualSchema.safeParse(body);

  if (!bodyValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      bodyValidation.error.errors
    );
  }

  const { id } = paramsValidation.data;
  const existing = tempoEstudoStore.getRegistroManualById(id);

  if (!existing) {
    throw new ServiceError('NOT_FOUND', 'Registro não encontrado', 404);
  }

  /**
   * @rule {BR-012}
   * Check edit period
   */
  const daysSinceCreation = Math.floor(
    (new Date().getTime() - new Date(existing.dataCriacao).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceCreation > TEMPO_ESTUDO_DEFAULTS.DIAS_EDICAO_REGISTRO_MANUAL) {
    throw new ServiceError(
      'EDIT_PERIOD_EXPIRED',
      'Este registro não pode mais ser editado devido ao prazo expirado',
      400
    );
  }

  const { materiaId, dataEstudo, horarioInicio, horarioFim, descricao } = bodyValidation.data;

  /**
   * @rule {BR-013}
   * Check for time overlap (excluding current record)
   */
  if (
    tempoEstudoStore.hasTimeOverlap(existing.usuarioId, dataEstudo, horarioInicio, horarioFim, id)
  ) {
    throw new ServiceError(
      'TIME_OVERLAP',
      'Já existe um registro de estudo ou sessão ativa neste horário',
      400
    );
  }

  const [startHour, startMin] = horarioInicio.split(':').map(Number);
  const [endHour, endMin] = horarioFim.split(':').map(Number);
  const duracaoMinutos = endHour * 60 + endMin - (startHour * 60 + startMin);

  const updated = tempoEstudoStore.updateRegistroManual(id, {
    materiaId,
    dataEstudo,
    horarioInicio,
    horarioFim,
    duracaoMinutos,
    descricao,
    dataAtualizacao: new Date().toISOString(),
  });

  return updated as RegistroManualEntity;
}

/**
 * @summary
 * Deletes a manual study time record.
 *
 * @function registroManualDeletar
 * @module services/tempoEstudo
 *
 * @param {unknown} params - Raw request params containing the ID
 * @returns {Promise<{ message: string }>} Success confirmation message
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When params fails validation
 * @throws {ServiceError} NOT_FOUND (404) - When record does not exist
 */
export async function registroManualDeletar(params: unknown): Promise<{ message: string }> {
  const validation = paramsSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, validation.error.errors);
  }

  const { id } = validation.data;
  const existing = tempoEstudoStore.getRegistroManualById(id);

  if (!existing) {
    throw new ServiceError('NOT_FOUND', 'Registro não encontrado', 404);
  }

  tempoEstudoStore.deleteRegistroManual(id);
  return { message: 'Registro excluído com sucesso' };
}

/**
 * @summary
 * Edits an automatic study session.
 *
 * @function sessaoAutomaticaEditar
 * @module services/tempoEstudo
 *
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<SessaoEstudoEntity>} The edited session
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 * @throws {ServiceError} NOT_FOUND (404) - When session does not exist
 * @throws {ServiceError} EDIT_PERIOD_EXPIRED (400) - When edit period has expired
 * @throws {ServiceError} INVALID_STATUS (400) - When session status is not editable
 */
export async function sessaoAutomaticaEditar(body: unknown): Promise<SessaoEstudoEntity> {
  const validation = editarSessaoAutomaticaSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const { sessaoId, motivoEdicao, novaDataHoraFim, novaMateriaId } = validation.data;
  const sessao = tempoEstudoStore.getSessaoById(sessaoId);

  if (!sessao) {
    throw new ServiceError('NOT_FOUND', 'Sessão não encontrada', 404);
  }

  /**
   * @rule {BR-029}
   * Check edit period
   */
  const hoursSinceStart = Math.floor(
    (new Date().getTime() - new Date(sessao.dataHoraInicio).getTime()) / (1000 * 60 * 60)
  );
  if (hoursSinceStart > TEMPO_ESTUDO_DEFAULTS.HORAS_EDICAO_SESSAO_AUTOMATICA) {
    throw new ServiceError(
      'EDIT_PERIOD_EXPIRED',
      'Esta sessão não pode mais ser editada devido ao prazo expirado',
      400
    );
  }

  /**
   * @rule {BR-030}
   * Check session status
   */
  if (sessao.status !== STATUS_SESSAO.COMPLETED && sessao.status !== STATUS_SESSAO.INTERRUPTED) {
    throw new ServiceError(
      'INVALID_STATUS',
      'Apenas sessões concluídas ou interrompidas podem ser editadas',
      400
    );
  }

  const updateData: Partial<SessaoEstudoEntity> = {};

  if (novaDataHoraFim) {
    const newDuration = calculateDurationMinutes(sessao.dataHoraInicio, novaDataHoraFim);
    const pausas = tempoEstudoStore.getPausasBySessao(sessaoId);
    const totalPauseMinutes = pausas.reduce((sum, p) => sum + (p.duracaoMinutos || 0), 0);
    const effectiveMinutes = newDuration - totalPauseMinutes;

    updateData.dataHoraFim = novaDataHoraFim;
    updateData.duracaoTotalMinutos = effectiveMinutes;
  }

  if (novaMateriaId) {
    updateData.materiaId = novaMateriaId;
  }

  const updated = tempoEstudoStore.updateSessao(sessaoId, updateData);
  return updated as SessaoEstudoEntity;
}

/**
 * @summary
 * Gets session history with filters.
 *
 * @function historicoSessoesObter
 * @module services/tempoEstudo
 *
 * @param {unknown} query - Raw query parameters to validate
 * @returns {Promise<HistoricoSessaoItem[]>} List of session history items
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When query fails schema validation
 */
export async function historicoSessoesObter(query: unknown): Promise<HistoricoSessaoItem[]> {
  const validation = historicoSessoesSchema.safeParse(query);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const { usuarioId, materiaId, dataInicio, dataFim } = validation.data;

  let sessoes = tempoEstudoStore.getSessoesByUsuario(usuarioId);
  let registros = tempoEstudoStore.getRegistrosManuaisByUsuario(usuarioId);

  if (materiaId) {
    sessoes = sessoes.filter((s) => s.materiaId === materiaId);
    registros = registros.filter((r) => r.materiaId === materiaId);
  }

  if (dataInicio) {
    sessoes = sessoes.filter((s) => s.dataHoraInicio >= dataInicio);
    registros = registros.filter((r) => r.dataEstudo >= dataInicio);
  }

  if (dataFim) {
    sessoes = sessoes.filter((s) => s.dataHoraInicio <= dataFim);
    registros = registros.filter((r) => r.dataEstudo <= dataFim);
  }

  const items: HistoricoSessaoItem[] = [];

  for (const sessao of sessoes) {
    const pausas = tempoEstudoStore.getPausasBySessao(sessao.id);
    const totalPauseMinutes = pausas.reduce((sum, p) => sum + (p.duracaoMinutos || 0), 0);

    items.push({
      id: sessao.id,
      tipo: 'automatic_session',
      materiaNome: `Matéria ${sessao.materiaId}`,
      dataEstudo: sessao.dataHoraInicio.split('T')[0],
      duracaoFormatada: formatMinutesToHHMM(sessao.duracaoTotalMinutos || 0),
      status:
        sessao.status === STATUS_SESSAO.COMPLETED
          ? 'Concluída'
          : sessao.status === STATUS_SESSAO.INTERRUPTED
          ? 'Interrompida'
          : 'Em andamento',
      quantidadePausas: pausas.length,
      duracaoTotalPausasFormatada: formatMinutesToHHMM(totalPauseMinutes),
    });
  }

  for (const registro of registros) {
    items.push({
      id: registro.id,
      tipo: 'manual_record',
      materiaNome: `Matéria ${registro.materiaId}`,
      dataEstudo: registro.dataEstudo,
      duracaoFormatada: formatMinutesToHHMM(registro.duracaoMinutos),
      status: 'Manual',
    });
  }

  items.sort((a, b) => b.dataEstudo.localeCompare(a.dataEstudo));

  return items;
}

/**
 * @summary
 * Gets time statistics for a period.
 *
 * @function estatisticasTempoObter
 * @module services/tempoEstudo
 *
 * @param {unknown} query - Raw query parameters to validate
 * @returns {Promise<EstatisticasTempoResponse>} Time statistics
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When query fails schema validation
 */
export async function estatisticasTempoObter(query: unknown): Promise<EstatisticasTempoResponse> {
  const validation = estatisticasTempoSchema.safeParse(query);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const { usuarioId, dataInicio, dataFim, materiaId } = validation.data;

  let sessoes = tempoEstudoStore
    .getSessoesByUsuario(usuarioId)
    .filter(
      (s) =>
        s.status === STATUS_SESSAO.COMPLETED &&
        s.dataHoraInicio >= dataInicio &&
        s.dataHoraInicio <= dataFim
    );

  let registros = tempoEstudoStore
    .getRegistrosManuaisByUsuario(usuarioId)
    .filter((r) => r.dataEstudo >= dataInicio && r.dataEstudo <= dataFim);

  if (materiaId) {
    sessoes = sessoes.filter((s) => s.materiaId === materiaId);
    registros = registros.filter((r) => r.materiaId === materiaId);
  }

  const tempoTotalMinutos =
    sessoes.reduce((sum, s) => sum + (s.duracaoTotalMinutos || 0), 0) +
    registros.reduce((sum, r) => sum + r.duracaoMinutos, 0);

  const totalDays = Math.ceil(
    (new Date(dataFim).getTime() - new Date(dataInicio).getTime()) / (1000 * 60 * 60 * 24)
  );

  const uniqueDates = new Set([
    ...sessoes.map((s) => s.dataHoraInicio.split('T')[0]),
    ...registros.map((r) => r.dataEstudo),
  ]);

  const diasComEstudo = uniqueDates.size;
  const totalSessoes = sessoes.length + registros.length;
  const mediaDiariaMinutos = totalDays > 0 ? tempoTotalMinutos / totalDays : 0;
  const mediaSessaoMinutos = totalSessoes > 0 ? tempoTotalMinutos / totalSessoes : 0;

  const materiaCount: { [key: number]: number } = {};
  sessoes.forEach((s) => {
    materiaCount[s.materiaId] = (materiaCount[s.materiaId] || 0) + (s.duracaoTotalMinutos || 0);
  });
  registros.forEach((r) => {
    materiaCount[r.materiaId] = (materiaCount[r.materiaId] || 0) + r.duracaoMinutos;
  });

  const materiasMaisEstudada =
    Object.keys(materiaCount).length > 0
      ? `Matéria ${Object.entries(materiaCount).sort((a, b) => b[1] - a[1])[0][0]}`
      : 'N/A';

  const consistenciaPercentual = totalDays > 0 ? (diasComEstudo / totalDays) * 100 : 0;

  return {
    tempoTotalMinutos,
    tempoTotalFormatado: formatMinutesToHHMM(tempoTotalMinutos),
    mediaDiariaMinutos: Number(mediaDiariaMinutos.toFixed(2)),
    mediaDiariaFormatada: formatMinutesToHHMM(mediaDiariaMinutos),
    diasComEstudo,
    totalSessoes,
    mediaSessaoMinutos: Number(mediaSessaoMinutos.toFixed(2)),
    mediaSessaoFormatada: formatMinutesToHHMM(mediaSessaoMinutos),
    materiasMaisEstudada,
    consistenciaPercentual: Number(consistenciaPercentual.toFixed(2)),
  };
}
