'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/** Main image types accepted for listing uploads. */
export const LISTING_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp';
export const LISTING_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const LISTING_IMAGE_MAX_FILES = 10;

interface ListingImageUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  mode: 'create' | 'edit';
  existingImageCount?: number;
}

interface PreviewItem {
  key: string;
  name: string;
  url: string;
}

function isAcceptedImage(file: File): boolean {
  return (LISTING_IMAGE_MIME_TYPES as readonly string[]).includes(file.type);
}

function fileKey(file: File, index: number): string {
  return `${file.name}-${file.size}-${file.lastModified}-${index}`;
}

export function ListingImageUpload({
  files,
  onFilesChange,
  mode,
  existingImageCount = 0,
}: ListingImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<PreviewItem[]>([]);

  useEffect(() => {
    const nextUrls: string[] = [];
    const nextPreviews = files.map((file, index) => {
      const url = URL.createObjectURL(file);
      nextUrls.push(url);
      return { key: fileKey(file, index), name: file.name, url };
    });
    setPreviews(nextPreviews);

    return () => {
      for (const url of nextUrls) URL.revokeObjectURL(url);
    };
  }, [files]);

  const handleChange = (selected: FileList | null) => {
    setError(null);
    const incoming = Array.from(selected ?? []);
    const rejected = incoming.filter((file) => !isAcceptedImage(file));
    const accepted = incoming.filter(isAcceptedImage);
    if (rejected.length > 0) {
      setError('Only JPG, PNG, and WebP images are allowed.');
    }
    const merged = [...files, ...accepted].slice(0, LISTING_IMAGE_MAX_FILES);
    if (files.length + accepted.length > LISTING_IMAGE_MAX_FILES) {
      setError(`You can upload up to ${LISTING_IMAGE_MAX_FILES} images.`);
    }
    onFilesChange(merged);
  };

  const removeAt = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
    setError(null);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="images">Images (JPG, PNG, or WebP — up to {LISTING_IMAGE_MAX_FILES})</Label>
      <Input
        id="images"
        type="file"
        accept={LISTING_IMAGE_ACCEPT}
        multiple
        onChange={(e) => {
          handleChange(e.target.files);
          e.target.value = '';
        }}
      />
      <p className="text-xs text-muted-foreground">
        Accepted types: JPEG, PNG, WebP. {files.length}/{LISTING_IMAGE_MAX_FILES} selected.
      </p>
      {mode === 'edit' && existingImageCount > 0 && (
        <p className="text-xs text-muted-foreground">
          Existing images: {existingImageCount} (new uploads are appended)
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {previews.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {previews.map((preview, index) => (
            <li
              key={preview.key}
              className="relative overflow-hidden rounded-xl border border-border bg-muted/40"
            >
              <div className="relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element -- blob preview URLs */}
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute right-1.5 top-1.5 h-8 w-8 rounded-full shadow-soft"
                aria-label={`Remove ${preview.name}`}
                onClick={() => removeAt(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <p className="truncate px-2 py-1.5 text-[11px] text-muted-foreground">{preview.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
