import { useState } from 'react';
import { useNavigation } from '@/core/hooks/useNavigation';
import { Button } from '@/core/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Plus, FileText, CheckCircle2 } from 'lucide-react';
import { MaterialDidaticoForm } from '@/domain/material-didatico/components/MaterialDidaticoForm';
import type { MaterialDidatico } from '@/domain/material-didatico/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function MaterialDidaticoPage() {
  const { navigate } = useNavigation();
  const [showForm, setShowForm] = useState(false);
  const [createdMaterial, setCreatedMaterial] = useState<MaterialDidatico | null>(null);

  const handleSuccess = (material: MaterialDidatico) => {
    setCreatedMaterial(material);
    setShowForm(false);
  };

  const handleNewMaterial = () => {
    setCreatedMaterial(null);
    setShowForm(true);
  };

  const handleEdit = () => {
    if (createdMaterial) {
      navigate(`/material-didatico/${createdMaterial.id}/editar`);
    }
  };

  const handleBackToList = () => {
    navigate('/material-didatico');
  };

  if (createdMaterial) {
    return (
      <div className="space-y-6 py-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="bg-primary/10 size-12 flex shrink-0 items-center justify-center rounded-full">
              <CheckCircle2 className="text-primary size-6" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Material cadastrado com sucesso!</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  O material didático foi cadastrado e está disponível para os estudantes.
                </p>
              </div>

              <div className="bg-background space-y-2 rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <FileText className="text-primary size-5 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{createdMaterial.titulo}</p>
                    <div className="text-muted-foreground mt-2 space-y-1 text-sm">
                      <p>
                        <span className="font-medium">ID:</span> #{createdMaterial.id}
                      </p>
                      <p>
                        <span className="font-medium">Data de cadastro:</span>{' '}
                        {format(
                          new Date(createdMaterial.dataCadastro),
                          "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                          {
                            locale: ptBR,
                          }
                        )}
                      </p>
                      <p>
                        <span className="font-medium">Nível:</span>{' '}
                        {createdMaterial.nivelDificuldade === 'basico'
                          ? 'Básico'
                          : createdMaterial.nivelDificuldade === 'intermediario'
                          ? 'Intermediário'
                          : 'Avançado'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleNewMaterial} variant="default">
                  <Plus className="mr-2" />
                  Cadastrar Novo Material
                </Button>
                <Button onClick={handleEdit} variant="outline">
                  Editar Este Material
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

  if (showForm) {
    return (
      <div className="space-y-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cadastrar Material Didático</h1>
            <p className="text-muted-foreground mt-2">
              Preencha os campos abaixo para cadastrar um novo material didático
            </p>
          </div>
        </div>

        <MaterialDidaticoForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Materiais Didáticos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os materiais didáticos cadastrados no sistema
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2" />
          Cadastrar Material
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Materiais</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-8 text-center">
            Nenhum material cadastrado ainda.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export { MaterialDidaticoPage };
