/**
 * @hook useMaterialDidaticoList
 * @description Hook for managing material didático list operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { materialDidaticoService } from '../../services/materialDidaticoService';
import type { CreateMaterialDidaticoDto, UpdateMaterialDidaticoDto } from '../../types';

export const useMaterialDidaticoList = () => {
  const queryClient = useQueryClient();
  const queryKey = ['material-didatico'];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => materialDidaticoService.list(),
  });

  const { mutateAsync: create, isPending: isCreating } = useMutation({
    mutationFn: (dto: CreateMaterialDidaticoDto) => materialDidaticoService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const { mutateAsync: update, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateMaterialDidaticoDto }) =>
      materialDidaticoService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const { mutateAsync: remove, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => materialDidaticoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    materiais: data ?? [],
    isLoading,
    error,
    refetch,
    create,
    isCreating,
    update,
    isUpdating,
    remove,
    isDeleting,
  };
};
