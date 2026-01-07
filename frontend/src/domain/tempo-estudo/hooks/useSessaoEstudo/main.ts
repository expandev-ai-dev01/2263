/**
 * @hook useSessaoEstudo
 * @description Hook for managing study session operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tempoEstudoService } from '../../services/tempoEstudoService';
import type {
  IniciarSessaoDto,
  FinalizarSessaoDto,
  PausarSessaoDto,
  RetomarSessaoDto,
  EditarSessaoAutomaticaDto,
} from '../../types';

export const useSessaoEstudo = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: iniciar, isPending: isIniciando } = useMutation({
    mutationFn: (dto: IniciarSessaoDto) => tempoEstudoService.iniciarSessao(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tempo-estudo'] });
    },
  });

  const { mutateAsync: finalizar, isPending: isFinalizando } = useMutation({
    mutationFn: (dto: FinalizarSessaoDto) => tempoEstudoService.finalizarSessao(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tempo-estudo'] });
    },
  });

  const { mutateAsync: pausar, isPending: isPausando } = useMutation({
    mutationFn: (dto: PausarSessaoDto) => tempoEstudoService.pausarSessao(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tempo-estudo'] });
    },
  });

  const { mutateAsync: retomar, isPending: isRetomando } = useMutation({
    mutationFn: (dto: RetomarSessaoDto) => tempoEstudoService.retomarSessao(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tempo-estudo'] });
    },
  });

  const { mutateAsync: editar, isPending: isEditando } = useMutation({
    mutationFn: (dto: EditarSessaoAutomaticaDto) => tempoEstudoService.editarSessaoAutomatica(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tempo-estudo'] });
    },
  });

  return {
    iniciar,
    isIniciando,
    finalizar,
    isFinalizando,
    pausar,
    isPausando,
    retomar,
    isRetomando,
    editar,
    isEditando,
  };
};
