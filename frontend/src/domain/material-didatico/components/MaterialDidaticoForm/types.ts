import type { MaterialDidatico } from '../../types';

export interface MaterialDidaticoFormProps {
  material?: MaterialDidatico;
  onSuccess?: (material: MaterialDidatico) => void;
  onCancel?: () => void;
}
