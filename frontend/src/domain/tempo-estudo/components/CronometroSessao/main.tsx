import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Button } from '@/core/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { Clock, Play, Pause, Square, Loader2 } from 'lucide-react';
import type { CronometroSessaoProps } from './types';

function CronometroSessao({
  sessaoAtiva,
  onIniciar,
  onFinalizar,
  onPausar,
  onRetomar,
  isLoading = false,
}: CronometroSessaoProps) {
  const [materiaId, setMateriaId] = useState<number>(0);
  const [tempoDecorrido, setTempoDecorrido] = useState<number>(0);

  useEffect(() => {
    if (!sessaoAtiva || sessaoAtiva.status !== 'active') {
      return;
    }

    const inicio = new Date(sessaoAtiva.dataHoraInicio).getTime();
    const interval = setInterval(() => {
      const agora = Date.now();
      const decorrido = Math.floor((agora - inicio) / 1000);
      setTempoDecorrido(decorrido);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessaoAtiva]);

  const formatarTempo = (segundos: number): string => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
  };

  const handleIniciar = () => {
    if (materiaId > 0) {
      onIniciar(materiaId);
    }
  };

  const isActive = sessaoAtiva?.status === 'active';
  const isPaused = sessaoAtiva?.status === 'paused';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="text-primary size-5" />
          Cronômetro de Estudo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!sessaoAtiva && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Selecione a Matéria</label>
              <Select
                value={materiaId.toString()}
                onValueChange={(value) => setMateriaId(Number(value))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma matéria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Matéria Exemplo 1</SelectItem>
                  <SelectItem value="2">Matéria Exemplo 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleIniciar}
              disabled={materiaId === 0 || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Play className="mr-2" />}
              Iniciar Estudo
            </Button>
          </div>
        )}

        {sessaoAtiva && (
          <div className="space-y-6">
            <div className="bg-muted/50 flex flex-col items-center justify-center rounded-lg p-8">
              <p className="text-muted-foreground mb-2 text-sm">Tempo de Estudo</p>
              <p className="text-6xl font-bold tabular-nums">{formatarTempo(tempoDecorrido)}</p>
              <p className="text-muted-foreground mt-2 text-sm">
                Status: {isActive ? 'Em andamento' : isPaused ? 'Pausado' : 'Finalizado'}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {isActive && (
                <>
                  <Button onClick={onPausar} disabled={isLoading} variant="outline" size="lg">
                    {isLoading ? (
                      <Loader2 className="mr-2 animate-spin" />
                    ) : (
                      <Pause className="mr-2" />
                    )}
                    Pausar
                  </Button>
                  <Button
                    onClick={onFinalizar}
                    disabled={isLoading}
                    variant="default"
                    size="lg"
                    className="md:col-span-2"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 animate-spin" />
                    ) : (
                      <Square className="mr-2" />
                    )}
                    Finalizar
                  </Button>
                </>
              )}

              {isPaused && (
                <>
                  <Button onClick={onRetomar} disabled={isLoading} variant="default" size="lg">
                    {isLoading ? (
                      <Loader2 className="mr-2 animate-spin" />
                    ) : (
                      <Play className="mr-2" />
                    )}
                    Retomar
                  </Button>
                  <Button
                    onClick={onFinalizar}
                    disabled={isLoading}
                    variant="outline"
                    size="lg"
                    className="md:col-span-2"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 animate-spin" />
                    ) : (
                      <Square className="mr-2" />
                    )}
                    Finalizar
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { CronometroSessao };
