/**
 * @hook useDisciplinaList
 * @description Hook for managing disciplina list operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { disciplinaService } from '../../services/disciplinaService';
import type {
  CreateDisciplinaDto,
  UpdateDisciplinaDto,
  MoveDisciplinaDto,
  DeleteDisciplinaDto,
} from '../../types';

export const useDisciplinaList = () => {
  const queryClient = useQueryClient();
  const queryKey = ['disciplina'];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => disciplinaService.list(),
  });

  const { mutateAsync: create, isPending: isCreating } = useMutation({
    mutationFn: (dto: CreateDisciplinaDto) => disciplinaService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const { mutateAsync: update, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateDisciplinaDto }) =>
      disciplinaService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const { mutateAsync: remove, isPending: isDeleting } = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: DeleteDisciplinaDto }) =>
      disciplinaService.delete(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const { mutateAsync: move, isPending: isMoving } = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: MoveDisciplinaDto }) =>
      disciplinaService.move(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    disciplinas: data ?? [],
    isLoading,
    error,
    refetch,
    create,
    isCreating,
    update,
    isUpdating,
    remove,
    isDeleting,
    move,
    isMoving,
  };
};
