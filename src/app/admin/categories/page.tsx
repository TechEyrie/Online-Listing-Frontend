'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

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
    const out: Array<{ id: string; label: string; canDelete: boolean }> = [];
    const walk = (nodes: CategoryTreeNode[], prefix = '') => {
      for (const node of nodes) {
        out.push({
          id: node._id,
          label: `${prefix}${node.icon ? `${node.icon} ` : ''}${node.name}`,
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
        <p className="text-sm text-muted-foreground">Create and delete marketplace categories</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create category</CardTitle>
          <CardDescription>Admins can add roots or subcategories.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="🚗"
              />
            </div>
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
          <CardDescription>Delete only works for leaf categories without listings.</CardDescription>
        </CardHeader>
        <CardContent>
          {treeQuery.isLoading && <p className="text-sm">Loading...</p>}
          <ul className="space-y-2">
            {flatLeaves.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded border px-3 py-2 text-sm"
              >
                <span>{item.label}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  disabled={!item.canDelete || deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(item.id)}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
