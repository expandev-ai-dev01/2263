import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { Badge } from '@/core/components/badge';
import { Skeleton } from '@/core/components/skeleton';
import {
  ChevronRight,
  ChevronDown,
  Edit,
  Trash2,
  Move,
  FolderTree,
  Folder,
  FolderOpen,
} from 'lucide-react';
import type { DisciplinaTreeProps, TreeNode } from './types';
import type { DisciplinaListItem } from '../../types';

function DisciplinaTree({ disciplinas, onEdit, onDelete, onMove, isLoading }: DisciplinaTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const treeData = useMemo(() => {
    const buildTree = (
      items: DisciplinaListItem[],
      parentId: string | null = null,
      level: number = 0
    ): TreeNode[] => {
      return items
        .filter((item) => item.disciplinaPaiId === parentId)
        .sort((a, b) => a.ordemExibicao - b.ordemExibicao)
        .map((item) => ({
          ...item,
          level,
          children: buildTree(items, item.id, level + 1),
        }));
    };

    return buildTree(disciplinas);
  }, [disciplinas]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const renderNode = (node: TreeNode) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.id} className="space-y-2">
        <div
          className="bg-muted/50 group flex items-center gap-3 rounded-lg border p-3 transition-all hover:shadow-md"
          style={{ marginLeft: `${node.level * 24}px` }}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleNode(node.id)}
              className="hover:bg-accent size-6 flex shrink-0 items-center justify-center rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>
          ) : (
            <div className="size-6 shrink-0" />
          )}

          <div className="bg-primary/10 size-10 flex shrink-0 items-center justify-center rounded-lg">
            {hasChildren ? (
              isExpanded ? (
                <FolderOpen className="text-primary size-5" />
              ) : (
                <Folder className="text-primary size-5" />
              )
            ) : (
              <FolderTree className="text-primary size-5" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{node.nomeDisciplina}</p>
              {!node.ativa && <Badge variant="secondary">Inativa</Badge>}
              {node.possuiSubdisciplinas && (
                <Badge variant="outline">{node.children.length} subdisciplinas</Badge>
              )}
            </div>
            <p className="text-muted-foreground text-xs">Ordem: {node.ordemExibicao}</p>
          </div>

          <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            {onEdit && (
              <Button size="icon-sm" variant="ghost" onClick={() => onEdit(node)} title="Editar">
                <Edit className="size-4" />
              </Button>
            )}
            {onMove && (
              <Button size="icon-sm" variant="ghost" onClick={() => onMove(node)} title="Mover">
                <Move className="size-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => onDelete(node)}
                title="Excluir"
                disabled={node.possuiSubdisciplinas}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="space-y-2">{node.children.map((child) => renderNode(child))}</div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estrutura de Disciplinas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderTree className="text-primary size-5" />
          Estrutura de Disciplinas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {treeData.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">Nenhuma disciplina cadastrada.</p>
        ) : (
          <div className="space-y-2">{treeData.map((node) => renderNode(node))}</div>
        )}
      </CardContent>
    </Card>
  );
}

export { DisciplinaTree };
