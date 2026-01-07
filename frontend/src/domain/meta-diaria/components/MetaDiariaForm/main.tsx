import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, X } from 'lucide-react';

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
import { Separator } from '@/core/components/separator';
import { Badge } from '@/core/components/badge';
import { DatePicker } from '@/core/components/date-picker';

import { metaDiariaSchema } from '../../validations/meta-diaria';
import type { MetaDiariaFormInput, MetaDiariaFormOutput } from '../../validations/meta-diaria';
import type { MetaDiariaFormProps } from './types';
import { useMetaDiariaList } from '../../hooks/useMetaDiariaList';
import { format } from 'date-fns';

function MetaDiariaForm({ meta, onSuccess, onCancel }: MetaDiariaFormProps) {
  const { create, isCreating } = useMetaDiariaList();
  const [topicoInput, setTopicoInput] = useState('');

  const form = useForm<MetaDiariaFormInput, unknown, MetaDiariaFormOutput>({
    resolver: zodResolver(metaDiariaSchema),
    mode: 'onBlur',
    defaultValues: {
      usuarioId: 1,
      dataMeta: meta?.dataMeta ?? format(new Date(), 'yyyy-MM-dd'),
      tituloMeta: meta?.tituloMeta ?? '',
      tempoTotalDesejado: meta?.tempoTotalDesejado ?? null,
      horariosPreferenciais: meta?.horariosPreferenciais ?? [],
      materiasSelecionadas: meta?.materiasSelecionadas ?? [],
      topicosEspecificos: meta?.topicosEspecificos ?? [],
      prioridade: meta?.prioridade ?? 'media',
    },
  });

  const {
    fields: horariosFields,
    append: appendHorario,
    remove: removeHorario,
  } = useFieldArray({
    control: form.control,
    name: 'horariosPreferenciais',
  });

  const handleAddTopico = () => {
    if (!topicoInput.trim()) return;

    const currentTopicos = form.getValues('topicosEspecificos') ?? [];
    if (currentTopicos.length >= 30) {
      toast.error('Máximo de 30 tópicos por meta');
      return;
    }

    if (currentTopicos.includes(topicoInput.trim())) {
      toast.error('Tópico já adicionado');
      return;
    }

    form.setValue('topicosEspecificos', [...currentTopicos, topicoInput.trim()]);
    setTopicoInput('');
  };

  const handleRemoveTopico = (topicoToRemove: string) => {
    const currentTopicos = form.getValues('topicosEspecificos') ?? [];
    form.setValue(
      'topicosEspecificos',
      currentTopicos.filter((topico) => topico !== topicoToRemove)
    );
  };

  const onSubmit = async (data: MetaDiariaFormOutput) => {
    try {
      const sanitizedData = {
        ...data,
        tituloMeta: DOMPurify.sanitize(data.tituloMeta),
      };

      const result = await create(sanitizedData);
      toast.success('Meta diária criada com sucesso!');
      onSuccess?.(result);
    } catch (error) {
      toast.error('Erro ao criar meta. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="dataMeta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Data da Meta <span className="text-destructive">*</span>
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
                name="prioridade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Prioridade <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="baixa">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tituloMeta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Título da Meta <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o título da meta" {...field} />
                  </FormControl>
                  <FormDescription>3-100 caracteres (letras, números, - e _)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tempoTotalDesejado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempo Total Desejado (minutos)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Tempo total opcional"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? Number(value) : null);
                      }}
                    />
                  </FormControl>
                  <FormDescription>Opcional. Múltiplo de 15 minutos (mínimo 15)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horários Preferenciais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {horariosFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4">
                <FormField
                  control={form.control}
                  name={`horariosPreferenciais.${index}.horarioInicio`}
                  render={({ field: fieldInner }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Horário Início</FormLabel>
                      <FormControl>
                        <Input type="time" {...fieldInner} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`horariosPreferenciais.${index}.horarioFim`}
                  render={({ field: fieldInner }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Horário Fim</FormLabel>
                      <FormControl>
                        <Input type="time" {...fieldInner} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeHorario(index)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}

            {horariosFields.length < 20 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => appendHorario({ horarioInicio: '', horarioFim: '' })}
              >
                <Plus className="mr-2" />
                Adicionar Horário
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Matérias e Tópicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="materiasSelecionadas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Matérias <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        const currentMaterias = field.value ?? [];
                        if (!currentMaterias.includes(Number(value))) {
                          field.onChange([...currentMaterias, Number(value)]);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione matérias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Matéria Exemplo 1</SelectItem>
                        <SelectItem value="2">Matéria Exemplo 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Selecione de 1 a 20 matérias</FormDescription>
                  {(field.value ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(field.value ?? []).map((materiaId) => (
                        <Badge key={materiaId} variant="secondary" className="gap-1">
                          Matéria {materiaId}
                          <button
                            type="button"
                            onClick={() => {
                              field.onChange((field.value ?? []).filter((id) => id !== materiaId));
                            }}
                            className="hover:text-destructive ml-1"
                          >
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="topicosEspecificos"
              render={() => (
                <FormItem>
                  <FormLabel>Tópicos Específicos</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Digite um tópico"
                          value={topicoInput}
                          onChange={(e) => setTopicoInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTopico();
                            }
                          }}
                        />
                        <Button type="button" variant="outline" onClick={handleAddTopico}>
                          Adicionar
                        </Button>
                      </div>
                      {(form.watch('topicosEspecificos') ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {(form.watch('topicosEspecificos') ?? []).map((topico) => (
                            <Badge key={topico} variant="secondary" className="gap-1">
                              {topico}
                              <button
                                type="button"
                                onClick={() => handleRemoveTopico(topico)}
                                className="hover:text-destructive ml-1"
                              >
                                <X className="size-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>Máximo de 30 tópicos (3-100 caracteres cada)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isCreating}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isCreating || !form.formState.isValid}>
            {isCreating && <Loader2 className="mr-2 animate-spin" />}
            Criar Meta
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { MetaDiariaForm };
