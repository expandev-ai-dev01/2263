import type { DisciplinaListItem } from '../../types';

export interface DisciplinaTreeProps {
  disciplinas: DisciplinaListItem[];
  onEdit?: (disciplina: DisciplinaListItem) => void;
  onDelete?: (disciplina: DisciplinaListItem) => void;
  onMove?: (disciplina: DisciplinaListItem) => void;
  isLoading?: boolean;
}

export interface TreeNode extends DisciplinaListItem {
  children: TreeNode[];
  level: number;
}
