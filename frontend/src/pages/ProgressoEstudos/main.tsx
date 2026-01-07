import { useState } from 'react';
import { Button } from '@/core/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Settings } from 'lucide-react';
import { DashboardCard } from '@/domain/progresso-estudos/components/DashboardCard';
import { EstatisticasTempoCard } from '@/domain/progresso-estudos/components/EstatisticasTempoCard';
import { GraficoEvolucaoCard } from '@/domain/progresso-estudos/components/GraficoEvolucaoCard';
import { ComparacaoPeriodosCard } from '@/domain/progresso-estudos/components/ComparacaoPeriodosCard';
import { PreferenciasNotificacaoForm } from '@/domain/progresso-estudos/components/PreferenciasNotificacaoForm';
import { useDashboardProgresso } from '@/domain/progresso-estudos/hooks/useDashboardProgresso';
import { useEstatisticasTempo } from '@/domain/progresso-estudos/hooks/useEstatisticasTempo';
import { useGraficoEvolucao } from '@/domain/progresso-estudos/hooks/useGraficoEvolucao';
import { useComparacaoPeriodos } from '@/domain/progresso-estudos/hooks/useComparacaoPeriodos';
import type { FiltrosProgresso } from '@/domain/progresso-estudos/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/core/components/dialog';
import { toast } from 'sonner';

function ProgressoEstudosPage() {
  const usuarioId = 1;
  const [showPreferencias, setShowPreferencias] = useState(false);
  const [periodoTempo, setPeriodoTempo] = useState<'diario' | 'semanal' | 'mensal'>('diario');
  const [graficoConfig, setGraficoConfig] = useState({
    tipoGrafico: 'linha' as 'linha' | 'barra' | 'area',
    periodoGrafico: '30dias' as '7dias' | '30dias' | '90dias' | '1ano',
    metricaExibida: 'tempo_estudo' as
      | 'tempo_estudo'
      | 'conteudos_concluidos'
      | 'desempenho_questoes'
      | 'percentual_acertos'
      | 'questoes_resolvidas',
  });
  const [comparacaoConfig, setComparacaoConfig] = useState({
    periodoAtual: 'este_mes' as 'esta_semana' | 'este_mes' | 'este_trimestre',
    periodoComparacao: 'mes_anterior' as 'semana_anterior' | 'mes_anterior' | 'trimestre_anterior',
    metricaComparacao: 'tempo_estudo' as
      | 'tempo_estudo'
      | 'conteudos_concluidos'
      | 'desempenho_questoes',
  });
  const [filtros] = useState<FiltrosProgresso | undefined>(undefined);

  const { dashboard, isLoading: isDashboardLoading } = useDashboardProgresso(usuarioId);
  const { estatisticas, isLoading: isEstatisticasLoading } = useEstatisticasTempo(
    usuarioId,
    periodoTempo
  );
  const { grafico, isLoading: isGraficoLoading } = useGraficoEvolucao({
    usuarioId,
    ...graficoConfig,
    filtros,
  });
  const { comparacao, isLoading: isComparacaoLoading } = useComparacaoPeriodos({
    usuarioId,
    ...comparacaoConfig,
    filtros,
  });

  const handlePreferenciasSuccess = () => {
    setShowPreferencias(false);
    toast.success('Preferências salvas com sucesso!');
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Progresso de Estudos</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe seu desempenho e evolução nos estudos
          </p>
        </div>
        <Button onClick={() => setShowPreferencias(true)} variant="outline">
          <Settings className="mr-2" />
          Preferências
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {dashboard && <DashboardCard dashboard={dashboard} isLoading={isDashboardLoading} />}

        {estatisticas && (
          <EstatisticasTempoCard
            estatisticas={estatisticas}
            isLoading={isEstatisticasLoading}
            onPeriodoChange={setPeriodoTempo}
          />
        )}
      </div>

      {grafico && (
        <GraficoEvolucaoCard
          grafico={grafico}
          isLoading={isGraficoLoading}
          onConfigChange={setGraficoConfig}
        />
      )}

      {comparacao && (
        <ComparacaoPeriodosCard
          comparacao={comparacao}
          isLoading={isComparacaoLoading}
          onConfigChange={setComparacaoConfig}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Relatórios</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-8 text-center text-sm">
            Funcionalidade de geração de relatórios em desenvolvimento
          </p>
        </CardContent>
      </Card>

      <Dialog open={showPreferencias} onOpenChange={setShowPreferencias}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preferências de Notificação</DialogTitle>
          </DialogHeader>
          <PreferenciasNotificacaoForm
            onSuccess={handlePreferenciasSuccess}
            onCancel={() => setShowPreferencias(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { ProgressoEstudosPage };
