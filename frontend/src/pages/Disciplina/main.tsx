import { useState } from 'react';
import { Button } from '@/core/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Plus, CheckCircle2, FolderTree } from 'lucide-react';
import { DisciplinaForm } from '@/domain/disciplina/components/DisciplinaForm';
import { DisciplinaTree } from '@/domain/disciplina/components/DisciplinaTree';
import { useDisciplinaList } from '@/domain/disciplina/hooks/useDisciplinaList';
import type { Disciplina, DisciplinaListItem } from '@/domain/disciplina/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/core/components/alert-dialog';
import { toast } from 'sonner';

type ViewState = 'list' | 'create' | 'edit' | 'success';

function DisciplinaPage() {
  const [viewState, setViewState] = useState<ViewState>('list');
  const [selectedDisciplina, setSelectedDisciplina] = useState<Disciplina | null>(null);
  const [createdDisciplina, setCreatedDisciplina] = useState<Disciplina | null>(null);
  const [disciplinaToDelete, setDisciplinaToDelete] = useState<DisciplinaListItem | null>(null);

  const { disciplinas, isLoading, remove, isDeleting } = useDisciplinaList();

  const handleSuccess = (disciplina: Disciplina) => {
    setCreatedDisciplina(disciplina);
    setViewState('success');
  };

  const handleEdit = (disciplina: DisciplinaListItem) => {
    setSelectedDisciplina(disciplina as Disciplina);
    setViewState('edit');
  };

  const handleDeleteClick = (disciplina: DisciplinaListItem) => {
    if (disciplina.possuiSubdisciplinas) {
      toast.error('Não é possível excluir disciplina que possui subdisciplinas ativas');
      return;
    }
    setDisciplinaToDelete(disciplina);
  };

  const handleDeleteConfirm = async () => {
    if (!disciplinaToDelete) return;

    try {
      await remove({
        id: disciplinaToDelete.id,
        dto: {
          confirmacaoExclusao: true,
          motivoExclusao: 'Exclusão via interface',
        },
      });
      toast.success('Disciplina excluída com sucesso!');
      setDisciplinaToDelete(null);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message || 'Erro ao excluir disciplina';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleNewDisciplina = () => {
    setSelectedDisciplina(null);
    setCreatedDisciplina(null);
    setViewState('create');
  };

  const handleBackToList = () => {
    setSelectedDisciplina(null);
    setCreatedDisciplina(null);
    setViewState('list');
  };

  if (viewState === 'success' && createdDisciplina) {
    return (
      <div className="space-y-6 py-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="bg-primary/10 size-12 flex shrink-0 items-center justify-center rounded-full">
              <CheckCircle2 className="text-primary size-6" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Disciplina criada com sucesso!</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  A disciplina foi cadastrada e está disponível na estrutura hierárquica.
                </p>
              </div>

              <div className="bg-background space-y-2 rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <FolderTree className="text-primary size-5 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{createdDisciplina.nomeDisciplina}</p>
                    <div className="text-muted-foreground mt-2 space-y-1 text-sm">
                      <p>
                        <span className="font-medium">ID:</span> {createdDisciplina.id}
                      </p>
                      <p>
                        <span className="font-medium">Data de criação:</span>{' '}
                        {format(
                          new Date(createdDisciplina.dataCriacao),
                          "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                          {
                            locale: ptBR,
                          }
                        )}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{' '}
                        {createdDisciplina.ativa ? 'Ativa' : 'Inativa'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleNewDisciplina} variant="default">
                  <Plus className="mr-2" />
                  Criar Nova Disciplina
                </Button>
                <Button onClick={handleBackToList} variant="outline">
                  Voltar à Estrutura
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (viewState === 'create' || viewState === 'edit') {
    const disciplinasPai = disciplinas.filter(
      (d) => d.ativa && (!selectedDisciplina || d.id !== selectedDisciplina.id)
    );

    return (
      <div className="space-y-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {viewState === 'edit' ? 'Editar' : 'Criar'} Disciplina
            </h1>
            <p className="text-muted-foreground mt-2">
              {viewState === 'edit'
                ? 'Atualize as informações da disciplina'
                : 'Preencha os campos para criar uma nova disciplina'}
            </p>
          </div>
        </div>

        <DisciplinaForm
          disciplina={selectedDisciplina ?? undefined}
          disciplinasPai={disciplinasPai}
          onSuccess={handleSuccess}
          onCancel={handleBackToList}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organização de Disciplinas</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie a estrutura hierárquica de disciplinas do sistema
          </p>
        </div>
        <Button onClick={() => setViewState('create')}>
          <Plus className="mr-2" />
          Nova Disciplina
        </Button>
      </div>

      <DisciplinaTree
        disciplinas={disciplinas}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
      />

      {disciplinas.length === 0 && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Começar a Organizar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">
              Crie sua primeira disciplina para começar a organizar o conteúdo didático.
            </p>
            <Button onClick={() => setViewState('create')}>
              <Plus className="mr-2" />
              Criar Primeira Disciplina
            </Button>
          </CardContent>
        </Card>
      )}

      <AlertDialog
        open={!!disciplinaToDelete}
        onOpenChange={(open) => !open && setDisciplinaToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a disciplina{' '}
              <strong>{disciplinaToDelete?.nomeDisciplina}</strong>? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export { DisciplinaPage };
