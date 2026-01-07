/**
 * @summary
 * Centralized service exports.
 * Provides single import point for all business logic services.
 *
 * @module services
 */

export {
  materialDidaticoCreate,
  materialDidaticoList,
  materialDidaticoGet,
  materialDidaticoUpdate,
  materialDidaticoDelete,
} from './materialDidatico';

export {
  metaDiariaCreate,
  metaDiariaList,
  metaDiariaGet,
  metaDiariaUpdate,
  metaDiariaDelete,
  metaDiariaDuplicate,
} from './metaDiaria';

export {
  dashboardProgressoGet,
  estatisticasTempoGet,
  graficoEvolucaoGet,
  relatorioProgressoGenerate,
  preferenciasNotificacaoUpdate,
  comparacaoPeriodosGet,
} from './progressoEstudos';

export {
  sessaoIniciar,
  sessaoFinalizar,
  sessaoPausar,
  sessaoRetomar,
  registroManualCriar,
  registroManualAtualizar,
  registroManualDeletar,
  sessaoAutomaticaEditar,
  historicoSessoesObter,
  estatisticasTempoObter,
} from './tempoEstudo';

export type {
  MaterialDidaticoEntity,
  MaterialDidaticoCreateRequest,
  MaterialDidaticoUpdateRequest,
  MaterialDidaticoListResponse,
} from './materialDidatico';

export type {
  MetaDiariaEntity,
  MetaDiariaCreateRequest,
  MetaDiariaUpdateRequest,
  MetaDiariaListResponse,
  HorarioPreferencial,
} from './metaDiaria';

export type {
  DashboardProgressoGeral,
  EstatisticasTempoEstudo,
  GraficoEvolucao,
  AcompanhamentoMetas,
  RelatorioProgresso,
  PreferenciasNotificacao,
  ComparacaoPeriodos,
  DashboardProgressoRequest,
  EstatisticasTempoRequest,
  GraficoEvolucaoRequest,
  RelatorioProgressoRequest,
  PreferenciasNotificacaoRequest,
  ComparacaoPeriodosRequest,
} from './progressoEstudos';

export type {
  SessaoEstudoEntity,
  PausaEntity,
  RegistroManualEntity,
  HistoricoSessaoItem,
  EstatisticasTempoResponse,
  IniciarSessaoRequest,
  FinalizarSessaoRequest,
  PausarSessaoRequest,
  RetomarSessaoRequest,
  CriarRegistroManualRequest,
  AtualizarRegistroManualRequest,
  EditarSessaoAutomaticaRequest,
  HistoricoSessoesRequest,
  EstatisticasTempoRequest as TempoEstudoEstatisticasRequest,
} from './tempoEstudo';

export type {
  CreateInput as MaterialDidaticoCreateInput,
  UpdateInput as MaterialDidaticoUpdateInput,
  ParamsInput as MaterialDidaticoParamsInput,
} from './materialDidatico/materialDidaticoValidation';

export type {
  CreateInput as MetaDiariaCreateInput,
  UpdateInput as MetaDiariaUpdateInput,
  ParamsInput as MetaDiariaParamsInput,
  DuplicateInput as MetaDiariaDuplicateInput,
} from './metaDiaria/metaDiariaValidation';

export type {
  DashboardRequestInput,
  EstatisticasTempoRequestInput,
  GraficoEvolucaoRequestInput,
  RelatorioProgressoRequestInput,
  PreferenciasNotificacaoRequestInput,
  ComparacaoPeriodosRequestInput,
} from './progressoEstudos/progressoEstudosValidation';

export type {
  IniciarSessaoInput,
  FinalizarSessaoInput,
  PausarSessaoInput,
  RetomarSessaoInput,
  CriarRegistroManualInput,
  AtualizarRegistroManualInput,
  EditarSessaoAutomaticaInput,
  HistoricoSessoesInput,
  EstatisticasTempoInput,
  ParamsInput as TempoEstudoParamsInput,
} from './tempoEstudo/tempoEstudoValidation';
