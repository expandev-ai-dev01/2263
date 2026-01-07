import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Textarea } from '@/core/components/textarea';
import { Switch } from '@/core/components/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/core/components/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Separator } from '@/core/components/separator';

import { disciplinaSchema, disciplinaUpdateSchema } from '../../validations/disciplina';
import type { DisciplinaFormInput, DisciplinaFormOutput } from '../../validations/disciplina';
import type { DisciplinaFormProps } from './types';
import { useDisciplinaList } from '../../hooks/useDisciplinaList';

function DisciplinaForm({ disciplina, disciplinasPai, onSuccess, onCancel }: DisciplinaFormProps) {
  const { create, isCreating, update, isUpdating } = useDisciplinaList();
  const isEditing = !!disciplina;
  const isSubmitting = isCreating || isUpdating;

  const form = useForm<DisciplinaFormInput, unknown, DisciplinaFormOutput>({
    resolver: zodResolver(isEditing ? disciplinaUpdateSchema : disciplinaSchema),
    mode: 'onBlur',
    defaultValues: {
      nomeDisciplina: disciplina?.nomeDisciplina ?? '',
      descricao: disciplina?.descricao ?? '',
      disciplinaPaiId: disciplina?.disciplinaPaiId ?? null,
      ordemExibicao: disciplina?.ordemExibicao ?? 1,
      ativa: disciplina?.ativa ?? true,
    },
  });

  const onSubmit = async (data: DisciplinaFormOutput) => {
    try {
      const sanitizedData = {
        ...data,
        descricao: data.descricao ? DOMPurify.sanitize(data.descricao) : null,
      };

      let result;
      if (isEditing) {
        const { disciplinaPaiId: _disciplinaPaiId, ...updateDto } = sanitizedData;
        result = await update({ id: disciplina.id, dto: updateDto });
        toast.success('Disciplina atualizada com sucesso!');
      } else {
        result = await create(sanitizedData);
        toast.success('Disciplina criada com sucesso!');
      }

      onSuccess?.(result);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message || 'Erro ao salvar disciplina';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Disciplina</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="nomeDisciplina"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nome da Disciplina <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome da disciplina" {...field} />
                  </FormControl>
                  <FormDescription>
                    3-100 caracteres (letras, números, espaços e hífen)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição detalhada da disciplina"
                      className="min-h-[100px]"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormDescription>Máximo de 500 caracteres</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEditing && (
              <FormField
                control={form.control}
                name="disciplinaPaiId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disciplina Pai (opcional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? undefined}
                      disabled={!disciplinasPai || disciplinasPai.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma disciplina pai" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">Nenhuma (disciplina raiz)</SelectItem>
                        {disciplinasPai?.map((disc) => (
                          <SelectItem key={disc.id} value={disc.id}>
                            {disc.nomeDisciplina}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Deixe em branco para criar uma disciplina principal
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="ordemExibicao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ordem de Exibição <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ordem"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Número positivo para ordenação</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ativa"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Disciplina Ativa</FormLabel>
                      <FormDescription>
                        Disciplinas inativas não aparecem para estudantes
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
            {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
            {isEditing ? 'Atualizar' : 'Criar'} Disciplina
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { DisciplinaForm };
