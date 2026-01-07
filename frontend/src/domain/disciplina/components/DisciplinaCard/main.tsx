import { Card, CardContent } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { Badge } from '@/core/components/badge';
import { Edit, Trash2, FolderTree, CheckCircle2, XCircle } from 'lucide-react';
import type { DisciplinaCardProps } from './types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function DisciplinaCard({ disciplina, onEdit, onDelete }: DisciplinaCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="flex items-start gap-4 pt-6">
        <div className="bg-primary/10 size-12 flex shrink-0 items-center justify-center rounded-lg">
          <FolderTree className="text-primary size-6" />
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{disciplina.nomeDisciplina}</h3>
              {disciplina.ativa ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="size-3" />
                  Ativa
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <XCircle className="size-3" />
                  Inativa
                </Badge>
              )}
              {disciplina.possuiSubdisciplinas && (
                <Badge variant="outline">Possui subdisciplinas</Badge>
              )}
            </div>
            {disciplina.descricao && (
              <p className="text-muted-foreground mt-2 text-sm">{disciplina.descricao}</p>
            )}
          </div>

          <div className="text-muted-foreground flex flex-wrap gap-4 text-xs">
            <span>Ordem: {disciplina.ordemExibicao}</span>
            <span>•</span>
            <span>
              Criada em {format(new Date(disciplina.dataCriacao), 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          </div>

          <div className="flex gap-2">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit className="size-4 mr-2" />
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="outline"
                onClick={onDelete}
                disabled={disciplina.possuiSubdisciplinas}
              >
                <Trash2 className="size-4 mr-2" />
                Excluir
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { DisciplinaCard };
