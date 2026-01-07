import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Textarea } from '@/core/components/textarea';
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
import { DatePicker } from '@/core/components/date-picker';

import { registroManualSchema } from '../../validations/tempo-estudo';
import type {
  RegistroManualFormInput,
  RegistroManualFormOutput,
} from '../../validations/tempo-estudo';
import type { RegistroManualFormProps } from './types';
import { useRegistroManual } from '../../hooks/useRegistroManual';

function RegistroManualForm({ registro, onSuccess, onCancel }: RegistroManualFormProps) {
  const { criar, isCriando, atualizar, isAtualizando } = useRegistroManual();
  const isEditing = !!registro;
  const isSubmitting = isCriando || isAtualizando;

  const form = useForm<RegistroManualFormInput, unknown, RegistroManualFormOutput>({
    resolver: zodResolver(registroManualSchema),
    mode: 'onBlur',
    defaultValues: {
      usuarioId: 1,
      materiaId: registro?.materiaId ?? 0,
      dataEstudo: registro?.dataEstudo ?? format(new Date(), 'yyyy-MM-dd'),
      horarioInicio: registro?.horarioInicio ?? '',
      horarioFim: registro?.horarioFim ?? '',
      descricao: registro?.descricao ?? '',
    },
  });

  const onSubmit = async (data: RegistroManualFormOutput) => {
    try {
      const sanitizedData = {
        ...data,
        descricao: data.descricao ? DOMPurify.sanitize(data.descricao) : null,
      };

      let result;
      if (isEditing) {
        const { usuarioId: _usuarioId, ...updateDto } = sanitizedData;
        result = await atualizar({ id: registro.id, dto: updateDto });
        toast.success('Registro atualizado com sucesso!');
      } else {
        result = await criar(sanitizedData);
        toast.success('Registro criado com sucesso!');
      }

      onSuccess?.(result);
    } catch (error) {
      toast.error('Erro ao salvar registro. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Editar' : 'Novo'} Registro Manual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="dataEstudo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Data do Estudo <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value ? new Date(field.value) : undefined}
                        onDateChange={(date) => {
                          if (date) {
                            field.onChange(format(date, 'yyyy-MM-dd'));
                          }
                        }}
                        placeholder="Selecione a data"
                        formatStr="dd/MM/yyyy"
                      />
                    </FormControl>
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
                        <SelectItem value="1">Matéria Exemplo 1</SelectItem>
                        <SelectItem value="2">Matéria Exemplo 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="horarioInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Horário Início <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
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
                    <FormLabel>
                      Horário Fim <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição opcional do que foi estudado"
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
            {isEditing ? 'Atualizar' : 'Salvar'} Registro
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { RegistroManualForm };
