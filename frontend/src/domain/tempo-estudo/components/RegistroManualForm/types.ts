import type { RegistroManual } from '../../types';

export interface RegistroManualFormProps {
  registro?: RegistroManual;
  onSuccess?: (registro: RegistroManual) => void;
  onCancel?: () => void;
}
