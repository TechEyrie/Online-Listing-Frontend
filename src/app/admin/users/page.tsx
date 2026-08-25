'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApi } from '@/lib/admin-api';
import type { ApiErrorResponse } from '@/types/api';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [banned, setBanned] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['admin-users', search, role, banned],
    queryFn: () =>
      adminApi.getUsers({
        page: 1,
        limit: 50,
        search: search || undefined,
        role: role || undefined,
        banned: banned === '' ? undefined : banned === 'true',
      }),
  });

  const mutate = useMutation({
    mutationFn: async ({
      id,
      action,
    }: {
      id: string;
      action: 'ban' | 'unban' | 'delete';
    }) => {
      if (action === 'ban') return adminApi.banUser(id);
      if (action === 'unban') return adminApi.unbanUser(id);
      return adminApi.deleteUser(id);
    },
    onSuccess: async (_data, vars) => {
      setMessage(`User ${vars.action} succeeded`);
      setError(null);
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Action failed');
      setMessage(null);
    },
  });

  const users = query.data?.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-page-title">Users</h1>
        <p className="text-sm text-muted-foreground">Search, ban, unban, or soft-delete users</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All roles</option>
          {['user', 'agent', 'brand', 'admin', 'moderator'].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={banned}
          onChange={(e) => setBanned(e.target.value)}
        >
          <option value="">Any ban state</option>
          <option value="true">Banned</option>
          <option value="false">Not banned</option>
        </select>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}
      {query.isLoading && <p className="text-sm">Loading users...</p>}

      <div className="overflow-x-auto rounded-lg border bg-background">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="px-3 py-2 font-medium">{user.name}</td>
                <td className="px-3 py-2">{user.email}</td>
                <td className="px-3 py-2 capitalize">{user.role}</td>
                <td className="px-3 py-2">
                  {user.isBanned ? 'Banned' : user.isActive ? 'Active' : 'Inactive'}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    {user.role !== 'admin' && (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={mutate.isPending || user.isBanned}
                          onClick={() => mutate.mutate({ id: user._id, action: 'ban' })}
                        >
                          Ban
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={mutate.isPending || !user.isBanned}
                          onClick={() => mutate.mutate({ id: user._id, action: 'unban' })}
                        >
                          Unban
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          disabled={mutate.isPending}
                          onClick={() => mutate.mutate({ id: user._id, action: 'delete' })}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
