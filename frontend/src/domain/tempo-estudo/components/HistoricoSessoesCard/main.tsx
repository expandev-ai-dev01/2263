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
import { History, Clock, Pause } from 'lucide-react';
import type { HistoricoSessoesCardProps } from './types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function HistoricoSessoesCard({
  historico,
  isLoading,
  onFiltroMateriaChange,
}: HistoricoSessoesCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Sessões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Concluída':
        return 'default';
      case 'Interrompida':
        return 'destructive';
      case 'Manual':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="text-primary size-5" />
            Histórico de Sessões
          </CardTitle>

          {onFiltroMateriaChange && (
            <Select
              onValueChange={(value) => onFiltroMateriaChange(value ? Number(value) : undefined)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por matéria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Todas as matérias</SelectItem>
                <SelectItem value="1">Matéria Exemplo 1</SelectItem>
                <SelectItem value="2">Matéria Exemplo 2</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {historico.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">Nenhuma sessão registrada ainda.</p>
        ) : (
          <div className="space-y-4">
            {historico.map((sessao) => (
              <div
                key={sessao.id}
                className="bg-muted/50 flex items-start gap-4 rounded-lg border p-4 transition-all hover:shadow-md"
              >
                <div className="bg-primary/10 size-12 flex shrink-0 items-center justify-center rounded-full">
                  <Clock className="text-primary size-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{sessao.materiaNome}</p>
                      <p className="text-muted-foreground text-sm">
                        {format(new Date(sessao.dataEstudo), "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(sessao.status)}>{sessao.status}</Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="size-4" />
                      <span className="font-medium">{sessao.duracaoFormatada}</span>
                    </div>

                    {sessao.quantidadePausas !== undefined && sessao.quantidadePausas > 0 && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <div className="flex items-center gap-1">
                          <Pause className="size-4" />
                          <span className="text-muted-foreground">
                            {sessao.quantidadePausas} pausa{sessao.quantidadePausas > 1 ? 's' : ''}
                          </span>
                        </div>
                      </>
                    )}

                    {sessao.duracaoTotalPausasFormatada && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          Pausas: {sessao.duracaoTotalPausasFormatada}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { HistoricoSessoesCard };
