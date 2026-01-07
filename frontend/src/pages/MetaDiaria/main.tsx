import { useState } from 'react';
import { Button } from '@/core/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Plus, CheckCircle2, Target } from 'lucide-react';
import { MetaDiariaForm } from '@/domain/meta-diaria/components/MetaDiariaForm';
import { SessaoEstudoForm } from '@/domain/meta-diaria/components/SessaoEstudoForm';
import type { MetaDiaria } from '@/domain/meta-diaria/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type ViewState = 'list' | 'create-meta' | 'create-sessao' | 'success';

function MetaDiariaPage() {
  const [viewState, setViewState] = useState<ViewState>('list');
  const [createdMeta, setCreatedMeta] = useState<MetaDiaria | null>(null);

  const handleMetaSuccess = (meta: MetaDiaria) => {
    setCreatedMeta(meta);
    setViewState('create-sessao');
  };

  const handleSessaoSuccess = () => {
    setViewState('success');
  };

  const handleNewMeta = () => {
    setCreatedMeta(null);
    setViewState('create-meta');
  };

  const handleBackToList = () => {
    setCreatedMeta(null);
    setViewState('list');
  };

  if (viewState === 'success' && createdMeta) {
    return (
      <div className="space-y-6 py-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="bg-primary/10 size-12 flex shrink-0 items-center justify-center rounded-full">
              <CheckCircle2 className="text-primary size-6" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Meta criada com sucesso!</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Sua meta diária foi configurada e as sessões de estudo foram criadas.
                </p>
              </div>

              <div className="bg-background space-y-2 rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <Target className="text-primary size-5 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{createdMeta.tituloMeta}</p>
                    <div className="text-muted-foreground mt-2 space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Data:</span>{' '}
                        {format(new Date(createdMeta.dataMeta), "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}
                      </p>
                      <p>
                        <span className="font-medium">Prioridade:</span>{' '}
                        {createdMeta.prioridade === 'alta'
                          ? 'Alta'
                          : createdMeta.prioridade === 'media'
                          ? 'Média'
                          : 'Baixa'}
                      </p>
                      <p>
                        <span className="font-medium">Matérias:</span>{' '}
                        {createdMeta.materiasSelecionadas.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleNewMeta} variant="default">
                  <Plus className="mr-2" />
                  Criar Nova Meta
                </Button>
                <Button onClick={handleBackToList} variant="outline">
                  Voltar à Listagem
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (viewState === 'create-sessao' && createdMeta) {
    return (
      <div className="space-y-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Criar Sessões de Estudo</h1>
            <p className="text-muted-foreground mt-2">
              Configure as sessões de estudo para a meta: <strong>{createdMeta.tituloMeta}</strong>
            </p>
          </div>
        </div>

        <SessaoEstudoForm
          metaId={createdMeta.id}
          materiasSelecionadas={createdMeta.materiasSelecionadas}
          onSuccess={handleSessaoSuccess}
          onCancel={handleBackToList}
        />
      </div>
    );
  }

  if (viewState === 'create-meta') {
    return (
      <div className="space-y-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Definir Meta Diária</h1>
            <p className="text-muted-foreground mt-2">Configure sua meta de estudos para o dia</p>
          </div>
        </div>

        <MetaDiariaForm onSuccess={handleMetaSuccess} onCancel={() => setViewState('list')} />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metas Diárias</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas metas de estudo e acompanhe seu progresso
          </p>
        </div>
        <Button onClick={() => setViewState('create-meta')}>
          <Plus className="mr-2" />
          Definir Meta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Minhas Metas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-8 text-center">Nenhuma meta cadastrada ainda.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export { MetaDiariaPage };
