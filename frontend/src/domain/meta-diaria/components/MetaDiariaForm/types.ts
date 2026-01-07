import type { MetaDiaria } from '../../types';

export interface MetaDiariaFormProps {
  meta?: MetaDiaria;
  onSuccess?: (meta: MetaDiaria) => void;
  onCancel?: () => void;
}
