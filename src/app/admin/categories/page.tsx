'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { CategoryIconPicker } from '@/components/admin/category-icon-picker';
import { CategoryDropdown } from '@/components/categories/category-dropdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { categoryApi } from '@/lib/category-api';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiErrorResponse } from '@/types/api';
import type { CategoryTreeNode } from '@/types/category';

export default function AdminCategoriesPage() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [description, setDescription] = useState('');
  const [parent, setParent] = useState('');
  const [order, setOrder] = useState('0');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editIcon, setEditIcon] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const treeQuery = useQuery({
    queryKey: ['categories', 'tree', 'admin'],
    queryFn: async () => {
      const res = await categoryApi.getTree();
      return res.data;
    },
    enabled: user?.role === 'admin',
  });

  const createMutation = useMutation({
    mutationFn: () =>
      categoryApi.create({
        name,
        icon: icon || undefined,
        description: description || undefined,
        parent: parent || null,
        order: Number(order) || 0,
      }),
    onSuccess: async () => {
      setMessage('Category created');
      setError(null);
      setName('');
      setIcon('');
      setDescription('');
      setParent('');
      setOrder('0');
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Create failed');
      setMessage(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, nextIcon }: { id: string; nextIcon: string }) =>
      categoryApi.update(id, { icon: nextIcon || undefined }),
    onSuccess: async () => {
      setMessage('Category icon updated');
      setError(null);
      setEditingId(null);
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Update failed');
      setMessage(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryApi.remove(id),
    onSuccess: async () => {
      setMessage('Category deleted');
      setError(null);
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Delete failed');
      setMessage(null);
    },
  });

  const flatLeaves = useMemo(() => {
    const out: Array<{
      id: string;
      label: string;
      icon?: string;
      canDelete: boolean;
    }> = [];
    const walk = (nodes: CategoryTreeNode[], prefix = '') => {
      for (const node of nodes) {
        out.push({
          id: node._id,
          label: `${prefix}${node.name}`,
          icon: node.icon,
          canDelete: node.children.length === 0,
        });
        walk(node.children, `${prefix}${node.name} > `);
      }
    };
    walk(treeQuery.data ?? []);
    return out;
  }, [treeQuery.data]);

  if (user?.role !== 'admin') {
    return <p className="text-sm text-destructive">Admin access required for categories.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Create categories with icons, and update icons on existing ones
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create category</CardTitle>
          <CardDescription>Admins can add roots or subcategories.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Icon</Label>
            <CategoryIconPicker value={icon} onChange={setIcon} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Parent</Label>
              <CategoryDropdown
                tree={treeQuery.data ?? []}
                value={parent}
                onChange={setParent}
                includeEmpty
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                min={0}
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}
          <Button
            type="button"
            disabled={!name || createMutation.isPending}
            onClick={() => createMutation.mutate()}
          >
            {createMutation.isPending ? 'Creating...' : 'Create'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing categories</CardTitle>
          <CardDescription>
            Change icons anytime. Delete only works for leaf categories without listings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {treeQuery.isLoading && <p className="text-sm">Loading...</p>}
          <ul className="space-y-3">
            {flatLeaves.map((item) => (
              <li key={item.id} className="rounded border px-3 py-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-medium">
                    <span className="mr-2 text-lg">{item.icon || '•'}</span>
                    {item.label}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(editingId === item.id ? null : item.id);
                        setEditIcon(item.icon || '');
                      }}
                    >
                      {editingId === item.id ? 'Close' : 'Edit icon'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      disabled={!item.canDelete || deleteMutation.isPending}
                      onClick={() => deleteMutation.mutate(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                {editingId === item.id && (
                  <div className="mt-3 space-y-3 border-t pt-3">
                    <CategoryIconPicker value={editIcon} onChange={setEditIcon} />
                    <Button
                      type="button"
                      size="sm"
                      disabled={updateMutation.isPending}
                      onClick={() => updateMutation.mutate({ id: item.id, nextIcon: editIcon })}
                    >
                      {updateMutation.isPending ? 'Saving...' : 'Save icon'}
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
