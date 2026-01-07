import type { ComparacaoPeriodos } from '../../types';

export interface ComparacaoPeriodosCardProps {
  comparacao: ComparacaoPeriodos;
  isLoading?: boolean;
  onConfigChange?: (config: {
    periodoAtual: 'esta_semana' | 'este_mes' | 'este_trimestre';
    periodoComparacao: 'semana_anterior' | 'mes_anterior' | 'trimestre_anterior';
    metricaComparacao: 'tempo_estudo' | 'conteudos_concluidos' | 'desempenho_questoes';
  }) => void;
}
