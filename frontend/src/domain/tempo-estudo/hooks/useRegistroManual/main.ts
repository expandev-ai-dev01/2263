/**
 * @hook useRegistroManual
 * @description Hook for managing manual time records
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tempoEstudoService } from '../../services/tempoEstudoService';
import type { CriarRegistroManualDto, AtualizarRegistroManualDto } from '../../types';

export const useRegistroManual = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: criar, isPending: isCriando } = useMutation({
    mutationFn: (dto: CriarRegistroManualDto) => tempoEstudoService.criarRegistroManual(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tempo-estudo'] });
    },
  });

  const { mutateAsync: atualizar, isPending: isAtualizando } = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: AtualizarRegistroManualDto }) =>
      tempoEstudoService.atualizarRegistroManual(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tempo-estudo'] });
    },
  });

  const { mutateAsync: deletar, isPending: isDeletando } = useMutation({
    mutationFn: (id: number) => tempoEstudoService.deletarRegistroManual(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tempo-estudo'] });
    },
  });

  return {
    criar,
    isCriando,
    atualizar,
    isAtualizando,
    deletar,
    isDeletando,
  };
};
