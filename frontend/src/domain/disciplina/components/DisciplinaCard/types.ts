import type { Disciplina } from '../../types';

export interface DisciplinaCardProps {
  disciplina: Disciplina;
  onEdit?: () => void;
  onDelete?: () => void;
}
