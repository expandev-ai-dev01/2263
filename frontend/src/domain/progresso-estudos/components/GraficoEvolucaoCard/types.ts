import type { GraficoEvolucao, FiltrosProgresso } from '../../types';

export interface GraficoEvolucaoCardProps {
  grafico: GraficoEvolucao;
  isLoading?: boolean;
  onConfigChange?: (config: {
    tipoGrafico: 'linha' | 'barra' | 'area';
    periodoGrafico: '7dias' | '30dias' | '90dias' | '1ano';
    metricaExibida:
      | 'tempo_estudo'
      | 'conteudos_concluidos'
      | 'desempenho_questoes'
      | 'percentual_acertos'
      | 'questoes_resolvidas';
  }) => void;
  onFiltrosChange?: (filtros: FiltrosProgresso) => void;
}
