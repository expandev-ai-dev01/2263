import { useState } from 'react';
import { Button } from '@/core/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Plus, Clock } from 'lucide-react';
import { CronometroSessao } from '@/domain/tempo-estudo/components/CronometroSessao';
import { RegistroManualForm } from '@/domain/tempo-estudo/components/RegistroManualForm';
import { HistoricoSessoesCard } from '@/domain/tempo-estudo/components/HistoricoSessoesCard';
import { EstatisticasTempoCard } from '@/domain/tempo-estudo/components/EstatisticasTempoCard';
import { useSessaoEstudo } from '@/domain/tempo-estudo/hooks/useSessaoEstudo';
import { useHistoricoSessoes } from '@/domain/tempo-estudo/hooks/useHistoricoSessoes';
import { useEstatisticasTempoEstudo } from '@/domain/tempo-estudo/hooks/useEstatisticasTempoEstudo';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/core/components/dialog';
import { toast } from 'sonner';
import { format, subDays } from 'date-fns';

function TempoEstudoPage() {
  const usuarioId = 1;
  const [showRegistroManual, setShowRegistroManual] = useState(false);
  const [sessaoAtiva, setSessaoAtiva] = useState<any>(null);
  const [filtroMateria, setFiltroMateria] = useState<number | undefined>(undefined);

  const {
    iniciar,
    finalizar,
    pausar,
    retomar,
    isIniciando,
    isFinalizando,
    isPausando,
    isRetomando,
  } = useSessaoEstudo();

  const { historico, isLoading: isHistoricoLoading } = useHistoricoSessoes({
    usuarioId,
    materiaId: filtroMateria,
  });

  const dataFim = format(new Date(), 'yyyy-MM-dd');
  const dataInicio = format(subDays(new Date(), 30), 'yyyy-MM-dd');

  const { estatisticas, isLoading: isEstatisticasLoading } = useEstatisticasTempoEstudo({
    usuarioId,
    dataInicio,
    dataFim,
    materiaId: filtroMateria,
  });

  const handleIniciar = async (materiaId: number) => {
    try {
      const sessao = await iniciar({ usuarioId, materiaId });
      setSessaoAtiva(sessao);
      toast.success('Sessão de estudo iniciada!');
    } catch (error) {
      toast.error('Erro ao iniciar sessão. Tente novamente.');
      console.error(error);
    }
  };

  const handleFinalizar = async () => {
    if (!sessaoAtiva) return;

    try {
      await finalizar({ sessaoId: sessaoAtiva.id });
      setSessaoAtiva(null);
      toast.success('Sessão finalizada com sucesso!');
    } catch (error) {
      toast.error('Erro ao finalizar sessão. Tente novamente.');
      console.error(error);
    }
  };

  const handlePausar = async () => {
    if (!sessaoAtiva) return;

    try {
      const sessao = await pausar({ sessaoId: sessaoAtiva.id });
      setSessaoAtiva(sessao);
      toast.success('Sessão pausada.');
    } catch (error) {
      toast.error('Erro ao pausar sessão. Tente novamente.');
      console.error(error);
    }
  };

  const handleRetomar = async () => {
    if (!sessaoAtiva) return;

    try {
      const sessao = await retomar({ sessaoId: sessaoAtiva.id });
      setSessaoAtiva(sessao);
      toast.success('Sessão retomada!');
    } catch (error) {
      toast.error('Erro ao retomar sessão. Tente novamente.');
      console.error(error);
    }
  };

  const handleRegistroManualSuccess = () => {
    setShowRegistroManual(false);
    toast.success('Registro manual salvo com sucesso!');
  };

  const isLoading = isIniciando || isFinalizando || isPausando || isRetomando;

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registro de Tempo de Estudo</h1>
          <p className="text-muted-foreground mt-2">
            Controle suas sessões de estudo e acompanhe seu progresso
          </p>
        </div>
        <Button onClick={() => setShowRegistroManual(true)}>
          <Plus className="mr-2" />
          Registro Manual
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CronometroSessao
          sessaoAtiva={sessaoAtiva}
          onIniciar={handleIniciar}
          onFinalizar={handleFinalizar}
          onPausar={handlePausar}
          onRetomar={handleRetomar}
          isLoading={isLoading}
        />

        {estatisticas && (
          <EstatisticasTempoCard estatisticas={estatisticas} isLoading={isEstatisticasLoading} />
        )}
      </div>

      <HistoricoSessoesCard
        historico={historico}
        isLoading={isHistoricoLoading}
        onFiltroMateriaChange={setFiltroMateria}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="text-primary size-5" />
            Dicas de Produtividade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li>• Use o cronômetro para sessões de estudo focadas</li>
            <li>• Faça pausas regulares para manter a concentração</li>
            <li>• Registre manualmente sessões passadas para manter seu histórico completo</li>
            <li>• Acompanhe suas estatísticas para identificar padrões de estudo</li>
          </ul>
        </CardContent>
      </Card>

      <Dialog open={showRegistroManual} onOpenChange={setShowRegistroManual}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Registro Manual de Tempo</DialogTitle>
          </DialogHeader>
          <RegistroManualForm
            onSuccess={handleRegistroManualSuccess}
            onCancel={() => setShowRegistroManual(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { TempoEstudoPage };
