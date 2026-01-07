import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
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

import { sessaoEstudoSchema } from '../../validations/meta-diaria';
import type { SessaoEstudoFormInput, SessaoEstudoFormOutput } from '../../validations/meta-diaria';
import type { SessaoEstudoFormProps } from './types';
import { useState } from 'react';

function SessaoEstudoForm({
  metaId,
  materiasSelecionadas,
  onSuccess,
  onCancel,
}: SessaoEstudoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SessaoEstudoFormInput, unknown, SessaoEstudoFormOutput>({
    resolver: zodResolver(sessaoEstudoSchema),
    mode: 'onBlur',
    defaultValues: {
      metaId,
      horarioInicio: null,
      horarioFim: null,
      duracaoMinutos: 15,
      materiaId: 0,
      topico: null,
    },
  });

  const onSubmit = async (data: SessaoEstudoFormOutput) => {
    try {
      setIsSubmitting(true);
      console.log('Sessão criada:', data);
      toast.success('Sessão de estudo criada com sucesso!');
      onSuccess?.();
    } catch (error) {
      toast.error('Erro ao criar sessão. Tente novamente.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Nova Sessão de Estudo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="horarioInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário Início (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value || null);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="horarioFim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário Fim (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value || null);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="duracaoMinutos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Duração (minutos) <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Duração em minutos"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Múltiplo de 15 minutos (mínimo 15)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="materiaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Matéria <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma matéria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {materiasSelecionadas.map((materiaId) => (
                        <SelectItem key={materiaId} value={materiaId.toString()}>
                          Matéria {materiaId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Apenas matérias selecionadas na meta</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="topico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tópico Específico</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tópico da sessão (opcional)"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value || null);
                      }}
                    />
                  </FormControl>
                  <FormDescription>Máximo de 200 caracteres</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
            {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
            Criar Sessão
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { SessaoEstudoForm };
