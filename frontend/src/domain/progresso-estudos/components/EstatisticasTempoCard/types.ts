import type { EstatisticasTempo } from '../../types';

export interface EstatisticasTempoCardProps {
  estatisticas: EstatisticasTempo;
  isLoading?: boolean;
  onPeriodoChange?: (periodo: 'diario' | 'semanal' | 'mensal') => void;
}
