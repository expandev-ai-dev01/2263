import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { Skeleton } from '@/core/components/skeleton';
import { Badge } from '@/core/components/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ComparacaoPeriodosCardProps } from './types';

function ComparacaoPeriodosCard({
  comparacao,
  isLoading,
  onConfigChange,
}: ComparacaoPeriodosCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comparação de Períodos</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const getMetricaLabel = (metrica: string): string => {
    const labels: Record<string, string> = {
      tempo_estudo: 'Tempo de Estudo',
      conteudos_concluidos: 'Conteúdos Concluídos',
      desempenho_questoes: 'Desempenho em Questões',
    };
    return labels[metrica] ?? metrica;
  };

  const getPeriodoLabel = (periodo: string): string => {
    const labels: Record<string, string> = {
      esta_semana: 'Esta Semana',
      este_mes: 'Este Mês',
      este_trimestre: 'Este Trimestre',
      semana_anterior: 'Semana Anterior',
      mes_anterior: 'Mês Anterior',
      trimestre_anterior: 'Trimestre Anterior',
    };
    return labels[periodo] ?? periodo;
  };

  const variacao = comparacao.variacaoPercentual;
  const isPositive = variacao > 0;
  const isNeutral = variacao === 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>Comparação de Períodos</CardTitle>

          <div className="flex flex-wrap gap-2">
            <Select
              value={comparacao.periodoAtual}
              onValueChange={(value) =>
                onConfigChange?.({
                  periodoAtual: value as 'esta_semana' | 'este_mes' | 'este_trimestre',
                  periodoComparacao: comparacao.periodoComparacao,
                  metricaComparacao: comparacao.metricaComparacao,
                })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="esta_semana">Esta Semana</SelectItem>
                <SelectItem value="este_mes">Este Mês</SelectItem>
                <SelectItem value="este_trimestre">Este Trimestre</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={comparacao.metricaComparacao}
              onValueChange={(value) =>
                onConfigChange?.({
                  periodoAtual: comparacao.periodoAtual,
                  periodoComparacao: comparacao.periodoComparacao,
                  metricaComparacao: value as
                    | 'tempo_estudo'
                    | 'conteudos_concluidos'
                    | 'desempenho_questoes',
                })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tempo_estudo">Tempo de Estudo</SelectItem>
                <SelectItem value="conteudos_concluidos">Conteúdos</SelectItem>
                <SelectItem value="desempenho_questoes">Desempenho</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">
                {getPeriodoLabel(comparacao.periodoAtual)} vs{' '}
                {getPeriodoLabel(comparacao.periodoComparacao)}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {getMetricaLabel(comparacao.metricaComparacao)}
              </p>
            </div>

            <Badge
              variant={isPositive ? 'default' : isNeutral ? 'secondary' : 'destructive'}
              className="gap-1 text-lg"
            >
              {isPositive ? (
                <TrendingUp className="size-4" />
              ) : isNeutral ? (
                <Minus className="size-4" />
              ) : (
                <TrendingDown className="size-4" />
              )}
              {isPositive ? '+' : ''}
              {variacao.toFixed(1)}%
            </Badge>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-muted-foreground text-sm">
              {isPositive
                ? 'Você está melhorando! Continue assim.'
                : isNeutral
                ? 'Seu desempenho está estável.'
                : 'Seu desempenho caiu. Vamos retomar o ritmo?'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { ComparacaoPeriodosCard };
