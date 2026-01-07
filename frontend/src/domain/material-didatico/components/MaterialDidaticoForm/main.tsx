import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Upload, FileText, X } from 'lucide-react';

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
import { Badge } from '@/core/components/badge';

import { materialDidaticoSchema } from '../../validations/material-didatico';
import type {
  MaterialDidaticoFormInput,
  MaterialDidaticoFormOutput,
} from '../../validations/material-didatico';
import type { MaterialDidaticoFormProps } from './types';
import { useMaterialDidaticoList } from '../../hooks/useMaterialDidaticoList';

function MaterialDidaticoForm({ material, onSuccess, onCancel }: MaterialDidaticoFormProps) {
  const { create, isCreating } = useMaterialDidaticoList();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  const form = useForm<MaterialDidaticoFormInput, unknown, MaterialDidaticoFormOutput>({
    resolver: zodResolver(materialDidaticoSchema),
    mode: 'onBlur',
    defaultValues: {
      titulo: material?.titulo ?? '',
      editalId: material?.editalId ?? 0,
      disciplinaId: material?.disciplinaId ?? 0,
      descricao: material?.descricao ?? '',
      arquivoPdf: material?.arquivoPdf ?? '',
      tags: material?.tags ?? [],
      nivelDificuldade: material?.nivelDificuldade ?? 'basico',
      ordemApresentacao: material?.ordemApresentacao,
      usuarioCadastro: 1,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Apenas arquivos PDF são aceitos');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 50MB');
      return;
    }

    setPdfFile(file);
    form.setValue('arquivoPdf', file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setPdfPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;

    const currentTags = form.getValues('tags') ?? [];
    if (currentTags.length >= 10) {
      toast.error('Máximo de 10 tags por material');
      return;
    }

    if (currentTags.includes(tagInput.trim())) {
      toast.error('Tag já adicionada');
      return;
    }

    form.setValue('tags', [...currentTags, tagInput.trim()]);
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags') ?? [];
    form.setValue(
      'tags',
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const onSubmit = async (data: MaterialDidaticoFormOutput) => {
    try {
      const sanitizedData = {
        ...data,
        descricao: data.descricao ? DOMPurify.sanitize(data.descricao) : null,
      };

      const result = await create(sanitizedData);
      toast.success('Material cadastrado com sucesso!');
      onSuccess?.(result);
    } catch (error) {
      toast.error('Erro ao cadastrar material. Tente novamente.');
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
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Título <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o título do material" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="editalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Edital <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um edital" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Edital Exemplo 1</SelectItem>
                        <SelectItem value="2">Edital Exemplo 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="disciplinaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Disciplina <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                      disabled={!form.watch('editalId')}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma disciplina" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Disciplina Exemplo 1</SelectItem>
                        <SelectItem value="2">Disciplina Exemplo 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conteúdo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição detalhada do material"
                      className="min-h-[100px]"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormDescription>Máximo de 1000 caracteres</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="arquivoPdf"
              render={() => (
                <FormItem>
                  <FormLabel>
                    Arquivo PDF <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('pdf-upload')?.click()}
                        >
                          <Upload className="mr-2" />
                          Selecionar PDF
                        </Button>
                        <input
                          id="pdf-upload"
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        {pdfFile && (
                          <span className="text-muted-foreground text-sm">{pdfFile.name}</span>
                        )}
                      </div>
                      {pdfPreview && (
                        <div className="border-border flex items-center gap-4 rounded-lg border p-4">
                          <FileText className="text-primary size-12" />
                          <div className="flex-1">
                            <p className="font-medium">{pdfFile?.name}</p>
                            <p className="text-muted-foreground text-sm">
                              {((pdfFile?.size ?? 0) / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>Tamanho máximo: 50MB</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Digite uma tag"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                        />
                        <Button type="button" variant="outline" onClick={handleAddTag}>
                          Adicionar
                        </Button>
                      </div>
                      {(form.watch('tags') ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {(form.watch('tags') ?? []).map((tag) => (
                            <Badge key={tag} variant="secondary" className="gap-1">
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
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
                  <FormDescription>Máximo de 10 tags (2-30 caracteres cada)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nivelDificuldade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nível de Dificuldade <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basico">Básico</SelectItem>
                        <SelectItem value="intermediario">Intermediário</SelectItem>
                        <SelectItem value="avancado">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ordemApresentacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordem de Apresentação</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ordem (opcional)"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? Number(value) : undefined);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Se não informado, será calculado automaticamente
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            Salvar Material
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { MaterialDidaticoForm };
