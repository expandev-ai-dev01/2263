import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/core/components/tabs';
import { Skeleton } from '@/core/components/skeleton';
import { Clock } from 'lucide-react';
import type { EstatisticasTempoCardProps } from './types';

function EstatisticasTempoCard({
  estatisticas,
  isLoading,
  onPeriodoChange,
}: EstatisticasTempoCardProps) {
  const formatTempo = (minutos: number): string => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas === 0) return `${mins}min`;
    if (mins === 0) return `${horas}h`;
    return `${horas}h ${mins}min`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tempo de Estudo</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="text-primary size-5" />
          Tempo de Estudo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={estatisticas.periodoReferencia}
          onValueChange={(value) => onPeriodoChange?.(value as 'diario' | 'semanal' | 'mensal')}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="diario">Hoje</TabsTrigger>
            <TabsTrigger value="semanal">Semana</TabsTrigger>
            <TabsTrigger value="mensal">Mês</TabsTrigger>
          </TabsList>

          <TabsContent value="diario" className="mt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Tempo estudado hoje</p>
              <p className="mt-2 text-4xl font-bold">
                {formatTempo(estatisticas.tempoEstudoDiario)}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="semanal" className="mt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Tempo estudado esta semana</p>
              <p className="mt-2 text-4xl font-bold">
                {formatTempo(estatisticas.tempoEstudoSemanal)}
              </p>
              <p className="text-muted-foreground mt-2 text-xs">
                Média diária: {formatTempo(Math.floor(estatisticas.tempoEstudoSemanal / 7))}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="mensal" className="mt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Tempo estudado este mês</p>
              <p className="mt-2 text-4xl font-bold">
                {formatTempo(estatisticas.tempoEstudoMensal)}
              </p>
              <p className="text-muted-foreground mt-2 text-xs">
                Média diária: {formatTempo(Math.floor(estatisticas.tempoEstudoMensal / 30))}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export { EstatisticasTempoCard };
