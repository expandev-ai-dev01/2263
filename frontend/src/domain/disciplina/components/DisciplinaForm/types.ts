import type { Disciplina, DisciplinaListItem } from '../../types';

export interface DisciplinaFormProps {
  disciplina?: Disciplina;
  disciplinasPai?: DisciplinaListItem[];
  onSuccess?: (disciplina: Disciplina) => void;
  onCancel?: () => void;
}
