import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/core/components/button';
import { Switch } from '@/core/components/switch';
import { Checkbox } from '@/core/components/checkbox';
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

import { preferenciasNotificacaoSchema } from '../../validations/progresso-estudos';
import type {
  PreferenciasNotificacaoFormInput,
  PreferenciasNotificacaoFormOutput,
} from '../../validations/progresso-estudos';
import type { PreferenciasNotificacaoFormProps } from './types';
import { usePreferenciasNotificacao } from '../../hooks/usePreferenciasNotificacao';

function PreferenciasNotificacaoForm({
  preferencias,
  onSuccess,
  onCancel,
}: PreferenciasNotificacaoFormProps) {
  const { atualizar, isUpdating } = usePreferenciasNotificacao();

  const form = useForm<
    PreferenciasNotificacaoFormInput,
    unknown,
    PreferenciasNotificacaoFormOutput
  >({
    resolver: zodResolver(preferenciasNotificacaoSchema),
    mode: 'onBlur',
    defaultValues: {
      usuarioId: 1,
      notificacaoPushHabilitada: preferencias?.notificacaoPushHabilitada ?? true,
      notificacaoEmailHabilitada: preferencias?.notificacaoEmailHabilitada ?? true,
      notificacaoSmsHabilitada: preferencias?.notificacaoSmsHabilitada ?? false,
      tiposMarcoHabilitados: preferencias?.tiposMarcoHabilitados ?? [
        'meta_atingida',
        'streak_milestone',
        'progresso_percentual',
      ],
    },
  });

  const onSubmit = async (data: PreferenciasNotificacaoFormOutput) => {
    try {
      const result = await atualizar(data);
      toast.success('Preferências atualizadas com sucesso!');
      onSuccess?.(result);
    } catch (error) {
      toast.error('Erro ao atualizar preferências. Tente novamente.');
      console.error(error);
    }
  };

  const tiposMarcoOptions = [
    { value: 'meta_atingida', label: 'Metas Atingidas' },
    { value: 'streak_milestone', label: 'Marcos de Sequência' },
    { value: 'progresso_percentual', label: 'Marcos de Progresso' },
  ] as const;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Canais de Notificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="notificacaoPushHabilitada"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Notificações Push</FormLabel>
                    <FormDescription>
                      Receba notificações no navegador ou aplicativo
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notificacaoEmailHabilitada"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Notificações por Email</FormLabel>
                    <FormDescription>Receba notificações no seu email cadastrado</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notificacaoSmsHabilitada"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Notificações por SMS</FormLabel>
                    <FormDescription>Receba notificações no seu celular via SMS</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tipos de Marcos</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="tiposMarcoHabilitados"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormDescription>
                      Escolha quais tipos de marcos você deseja ser notificado
                    </FormDescription>
                  </div>
                  <div className="space-y-4">
                    {tiposMarcoOptions.map((option) => (
                      <FormField
                        key={option.value}
                        control={form.control}
                        name="tiposMarcoHabilitados"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.value}
                              className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value ?? []), option.value])
                                      : field.onChange(
                                          (field.value ?? []).filter(
                                            (value) => value !== option.value
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal">{option.label}</FormLabel>
                              </div>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isUpdating}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isUpdating || !form.formState.isValid}>
            {isUpdating && <Loader2 className="mr-2 animate-spin" />}
            Salvar Preferências
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { PreferenciasNotificacaoForm };
