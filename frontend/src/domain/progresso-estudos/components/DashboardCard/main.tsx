import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Progress } from '@/core/components/progress';
import { Badge } from '@/core/components/badge';
import { Skeleton } from '@/core/components/skeleton';
import { TrendingUp, BookOpen, Flame, Sparkles } from 'lucide-react';
import type { DashboardCardProps } from './types';

function DashboardCard({ dashboard, isLoading }: DashboardCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progresso Geral</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-24 w-full" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="text-primary size-5" />
          Progresso Geral
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Progresso Total</p>
              <p className="text-3xl font-bold">{dashboard.progressoGeralPercentual.toFixed(1)}%</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-sm">Conteúdos</p>
              <p className="text-lg font-semibold">
                {dashboard.conteudosConcluidos} / {dashboard.conteudosTotais}
              </p>
            </div>
          </div>
          <Progress value={dashboard.progressoGeralPercentual} className="h-3" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-4 transition-all hover:shadow-md">
            <div className="bg-primary/10 size-12 flex shrink-0 items-center justify-center rounded-full">
              <BookOpen className="text-primary size-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Concluídos</p>
              <p className="text-2xl font-bold">{dashboard.conteudosConcluidos}</p>
            </div>
          </div>

          <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-4 transition-all hover:shadow-md">
            <div className="size-12 flex shrink-0 items-center justify-center rounded-full bg-orange-500/10">
              <Flame className="size-6 text-orange-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Sequência</p>
              <p className="text-2xl font-bold">{dashboard.streakDiasConsecutivos} dias</p>
            </div>
          </div>

          {dashboard.conteudosAdicionadosRecentemente > 0 && (
            <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-4 transition-all hover:shadow-md">
              <div className="size-12 flex shrink-0 items-center justify-center rounded-full bg-purple-500/10">
                <Sparkles className="size-6 text-purple-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Novos</p>
                <p className="text-2xl font-bold">{dashboard.conteudosAdicionadosRecentemente}</p>
              </div>
            </div>
          )}
        </div>

        {dashboard.conteudosAdicionadosRecentemente > 0 && (
          <Badge variant="secondary" className="w-full justify-center py-2">
            <Sparkles className="size-4 mr-2" />
            {dashboard.conteudosAdicionadosRecentemente} novo(s) conteúdo(s) disponível(is)
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

export { DashboardCard };
