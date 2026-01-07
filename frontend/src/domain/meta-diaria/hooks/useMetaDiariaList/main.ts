/**
 * @hook useMetaDiariaList
 * @description Hook for managing meta diária list operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { metaDiariaService } from '../../services/metaDiariaService';
import type { CreateMetaDiariaDto, UpdateMetaDiariaDto, DuplicateMetaDiariaDto } from '../../types';

interface UseMetaDiariaListOptions {
  usuarioId?: number;
  dataMeta?: string;
  status?: 'ativa' | 'inativa' | 'concluida' | 'todas';
}

export const useMetaDiariaList = (options?: UseMetaDiariaListOptions) => {
  const queryClient = useQueryClient();
  const queryKey = ['meta-diaria', options];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => metaDiariaService.list(options),
  });

  const { mutateAsync: create, isPending: isCreating } = useMutation({
    mutationFn: (dto: CreateMetaDiariaDto) => metaDiariaService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meta-diaria'] });
    },
  });

  const { mutateAsync: update, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateMetaDiariaDto }) =>
      metaDiariaService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meta-diaria'] });
    },
  });

  const { mutateAsync: remove, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => metaDiariaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meta-diaria'] });
    },
  });

  const { mutateAsync: duplicate, isPending: isDuplicating } = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: DuplicateMetaDiariaDto }) =>
      metaDiariaService.duplicate(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meta-diaria'] });
    },
  });

  return {
    metas: data ?? [],
    isLoading,
    error,
    refetch,
    create,
    isCreating,
    update,
    isUpdating,
    remove,
    isDeleting,
    duplicate,
    isDuplicating,
  };
};
