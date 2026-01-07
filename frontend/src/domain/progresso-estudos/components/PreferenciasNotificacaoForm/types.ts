import type { PreferenciasNotificacao } from '../../types';

export interface PreferenciasNotificacaoFormProps {
  preferencias?: PreferenciasNotificacao;
  onSuccess?: (preferencias: PreferenciasNotificacao) => void;
  onCancel?: () => void;
}
