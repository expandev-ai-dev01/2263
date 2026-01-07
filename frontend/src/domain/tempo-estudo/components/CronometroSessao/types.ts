import type { SessaoEstudo } from '../../types';

export interface CronometroSessaoProps {
  sessaoAtiva?: SessaoEstudo | null;
  onIniciar: (materiaId: number) => void;
  onFinalizar: () => void;
  onPausar: () => void;
  onRetomar: () => void;
  isLoading?: boolean;
}
