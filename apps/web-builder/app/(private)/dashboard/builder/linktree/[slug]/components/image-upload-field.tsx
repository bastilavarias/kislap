'use client';

import { useEffect, useState } from 'react';
import { Image as ImageIcon, UploadCloud } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageUploadFieldProps {
  id: string;
  previewUrl?: string | null;
  currentFile?: File | null;
  onFileSelect: (file: File | null) => void;
}

export function ImageUploadField({ id, previewUrl, currentFile, onFileSelect }: ImageUploadFieldProps) {
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
    <div className="flex items-center gap-4">
      <div className="relative group h-20 w-20 shrink-0 rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
        {displayImage ? (
          <img src={displayImage} alt="Preview" className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
        )}
      </div>

      <div className="flex-1">
        <Label
          htmlFor={id}
          className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full"
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          {displayImage ? 'Change Image' : 'Upload Image'}
        </Label>
        <Input
          id={id}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
          }}
        />
        <p className="text-[10px] text-muted-foreground mt-2">Max 2MB. Supports PNG, JPG, WEBP.</p>
      </div>
    </div>
  );
}
