'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { userApi } from '@/lib/user-api';
import type { ApiErrorResponse } from '@/types/api';

interface AvatarUploadProps {
  avatarUrl?: string;
  name: string;
  onUploaded: (url: string) => void;
}

export function AvatarUpload({ avatarUrl, name, onUploaded }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(avatarUrl);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const onPick = () => inputRef.current?.click();

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const res = await userApi.updateAvatar(file);
      onUploaded(res.data.avatar);
      setPreview(res.data.avatar);
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Avatar upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted">
        {preview ? (
          <Image src={preview} alt={name} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl font-semibold">
            {name.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Button type="button" variant="outline" size="sm" onClick={onPick} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Change avatar'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void onChange(e)}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
