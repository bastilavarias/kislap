'use client';

import { useEffect, useState } from 'react';
import { Image as ImageIcon, UploadCloud } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ImageUploadFieldProps {
  id: string;
  previewUrl?: string | null;
  currentFile?: File | null;
  onFileSelect: (file: File | null) => void;
  orientation?: 'horizontal' | 'vertical';
}

export function ImageUploadField({
  id,
  previewUrl,
  currentFile,
  onFileSelect,
  orientation = 'horizontal',
}: ImageUploadFieldProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  useEffect(() => {
    if (currentFile) {
      const objectUrl = URL.createObjectURL(currentFile);
      setLocalPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setLocalPreview(null);
  }, [currentFile]);

  const displayImage = localPreview || previewUrl;

  return (
    <div
      className={cn(
        'flex gap-4',
        orientation === 'vertical' ? 'flex-col items-start' : 'items-center'
      )}
    >
      <div
        className={cn(
          'relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted',
          orientation === 'vertical' ? 'h-36 w-full' : 'h-20 w-20'
        )}
      >
        {displayImage ? (
          <img src={displayImage} alt="Preview" className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
        )}
      </div>

      <div className={cn(orientation === 'vertical' ? 'w-full' : 'flex-1')}>
        <Label
          htmlFor={id}
          className="inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          {displayImage ? 'Change Image' : 'Upload Image'}
        </Label>
        <Input
          id={id}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => onFileSelect(event.target.files?.[0] || null)}
        />
        <p className="mt-2 text-[10px] text-muted-foreground">Max 2MB. Supports PNG, JPG, WEBP.</p>
      </div>
    </div>
  );
}
