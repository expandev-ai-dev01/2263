import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Skeleton } from '@/core/components/skeleton';
import { Progress } from '@/core/components/progress';
import { BarChart3, TrendingUp, Calendar, Target } from 'lucide-react';
import type { EstatisticasTempoCardProps } from './types';

function EstatisticasTempoCard({ estatisticas, isLoading }: EstatisticasTempoCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Tempo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="text-primary size-5" />
          Estatísticas de Tempo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 space-y-3 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Tempo Total de Estudo</p>
              <p className="text-3xl font-bold">{estatisticas.tempoTotalFormatado}</p>
            </div>
            <div className="bg-primary/10 size-12 flex shrink-0 items-center justify-center rounded-full">
              <TrendingUp className="text-primary size-6" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-muted/50 space-y-2 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Calendar className="text-primary size-4" />
              <p className="text-muted-foreground text-sm">Média Diária</p>
            </div>
            <p className="text-2xl font-bold">{estatisticas.mediaDiariaFormatada}</p>
          </div>

          <div className="bg-muted/50 space-y-2 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Target className="text-primary size-4" />
              <p className="text-muted-foreground text-sm">Média por Sessão</p>
            </div>
            <p className="text-2xl font-bold">{estatisticas.mediaSessaoFormatada}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Consistência de Estudos</p>
            <p className="text-sm font-semibold">
              {estatisticas.consistenciaPercentual.toFixed(1)}%
            </p>
          </div>
          <Progress value={estatisticas.consistenciaPercentual} className="h-3" />
          <p className="text-muted-foreground text-xs">
            {estatisticas.diasComEstudo} dias com estudo de {estatisticas.totalSessoes} sessões
          </p>
        </div>

        {estatisticas.materiasMaisEstudada && (
          <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">Matéria Mais Estudada</p>
            <p className="mt-1 font-semibold">{estatisticas.materiasMaisEstudada}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { EstatisticasTempoCard };
