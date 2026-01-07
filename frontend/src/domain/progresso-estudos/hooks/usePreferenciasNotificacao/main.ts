/**
 * @hook usePreferenciasNotificacao
 * @description Hook for managing notification preferences
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { progressoEstudosService } from '../../services/progressoEstudosService';
import type { PreferenciasNotificacaoRequest } from '../../types';

export const usePreferenciasNotificacao = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: atualizar, isPending: isUpdating } = useMutation({
    mutationFn: (request: PreferenciasNotificacaoRequest) =>
      progressoEstudosService.atualizarPreferenciasNotificacao(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferencias-notificacao'] });
    },
  });

  return {
    atualizar,
    isUpdating,
  };
};
