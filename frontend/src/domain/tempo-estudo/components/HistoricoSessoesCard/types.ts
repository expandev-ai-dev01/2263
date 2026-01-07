import type { HistoricoSessao } from '../../types';

export interface HistoricoSessoesCardProps {
  historico: HistoricoSessao[];
  isLoading?: boolean;
  onFiltroMateriaChange?: (materiaId: number | undefined) => void;
}
