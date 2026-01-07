export interface SessaoEstudoFormProps {
  metaId: number;
  materiasSelecionadas: number[];
  onSuccess?: () => void;
  onCancel?: () => void;
}
