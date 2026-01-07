import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { Skeleton } from '@/core/components/skeleton';
import { BarChart3 } from 'lucide-react';
import type { GraficoEvolucaoCardProps } from './types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function GraficoEvolucaoCard({ grafico, isLoading, onConfigChange }: GraficoEvolucaoCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const getMetricaLabel = (metrica: string): string => {
    const labels: Record<string, string> = {
      tempo_estudo: 'Tempo de Estudo',
      conteudos_concluidos: 'Conteúdos Concluídos',
      desempenho_questoes: 'Desempenho em Questões',
      percentual_acertos: 'Percentual de Acertos',
      questoes_resolvidas: 'Questões Resolvidas',
    };
    return labels[metrica] ?? metrica;
  };

  const getPeriodoLabel = (periodo: string): string => {
    const labels: Record<string, string> = {
      '7dias': 'Últimos 7 dias',
      '30dias': 'Últimos 30 dias',
      '90dias': 'Últimos 90 dias',
      '1ano': 'Último ano',
    };
    return labels[periodo] ?? periodo;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="text-primary size-5" />
            Evolução - {getMetricaLabel(grafico.metricaExibida)}
          </CardTitle>

          <div className="flex flex-wrap gap-2">
            <Select
              value={grafico.tipoGrafico}
              onValueChange={(value) =>
                onConfigChange?.({
                  tipoGrafico: value as 'linha' | 'barra' | 'area',
                  periodoGrafico: grafico.periodoGrafico,
                  metricaExibida: grafico.metricaExibida,
                })
              }
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linha">Linha</SelectItem>
                <SelectItem value="barra">Barra</SelectItem>
                <SelectItem value="area">Área</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={grafico.periodoGrafico}
              onValueChange={(value) =>
                onConfigChange?.({
                  tipoGrafico: grafico.tipoGrafico,
                  periodoGrafico: value as '7dias' | '30dias' | '90dias' | '1ano',
                  metricaExibida: grafico.metricaExibida,
                })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7dias">7 dias</SelectItem>
                <SelectItem value="30dias">30 dias</SelectItem>
                <SelectItem value="90dias">90 dias</SelectItem>
                <SelectItem value="1ano">1 ano</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={grafico.metricaExibida}
              onValueChange={(value) =>
                onConfigChange?.({
                  tipoGrafico: grafico.tipoGrafico,
                  periodoGrafico: grafico.periodoGrafico,
                  metricaExibida: value as
                    | 'tempo_estudo'
                    | 'conteudos_concluidos'
                    | 'desempenho_questoes'
                    | 'percentual_acertos'
                    | 'questoes_resolvidas',
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
                <SelectItem value="percentual_acertos">% Acertos</SelectItem>
                <SelectItem value="questoes_resolvidas">Questões</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">{getPeriodoLabel(grafico.periodoGrafico)}</p>

          {grafico.dados && grafico.dados.length > 0 ? (
            <div className="space-y-2">
              {grafico.dados.map((ponto, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    {format(new Date(ponto.data), 'dd/MM', { locale: ptBR })}
                  </span>
                  <span className="font-semibold">{ponto.valor}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Dados insuficientes para o período selecionado
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { GraficoEvolucaoCard };
