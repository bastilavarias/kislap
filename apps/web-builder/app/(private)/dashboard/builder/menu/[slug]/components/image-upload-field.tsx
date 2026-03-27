'use client';

import { useEffect, useState } from 'react';
import { FileText, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type SupportedUploadType = 'image' | 'pdf';

interface ImageUploadFieldProps {
  id: string;
  previewUrl?: string | null;
  currentFile?: File | null;
  onFileSelect: (file: File | null) => void;
  orientation?: 'horizontal' | 'vertical';
  acceptedTypes?: SupportedUploadType[];
  maxSizeLabel?: string;
}

export function ImageUploadField({
  id,
  previewUrl,
  currentFile,
  onFileSelect,
  orientation = 'horizontal',
  acceptedTypes = ['image'],
  maxSizeLabel = 'Max 2MB.',
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
  const supportsImage = acceptedTypes.includes('image');
  const supportsPdf = acceptedTypes.includes('pdf');
  const currentType = currentFile?.type || '';
  const previewType = previewUrl?.toLowerCase() || '';
  const isPdf =
    currentType === 'application/pdf' ||
    (!currentType && (previewType.endsWith('.pdf') || previewType.includes('application/pdf')));
  const canRenderImage = supportsImage && !!displayImage && !isPdf;

  const accept = [
    supportsImage ? 'image/png,image/jpeg,image/jpg,image/webp' : null,
    supportsPdf ? 'application/pdf' : null,
  ]
    .filter(Boolean)
    .join(',');

  const uploadLabel =
    supportsImage && supportsPdf
      ? displayImage
        ? 'Change File'
        : 'Upload File'
      : displayImage
        ? 'Change Image'
        : 'Upload Image';

  const supportLabel = [supportsImage ? 'PNG, JPG, WEBP' : null, supportsPdf ? 'PDF' : null]
    .filter(Boolean)
    .join(', ');

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
        {canRenderImage ? (
          <img src={displayImage} alt="Preview" className="h-full w-full object-cover" />
        ) : isPdf ? (
          <div className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
            <FileText className="h-8 w-8 text-muted-foreground/50" />
            <span className="px-2 text-center text-[10px] font-medium uppercase tracking-wide">
              PDF
            </span>
          </div>
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
          {uploadLabel}
        </Label>
        <Input
          id={id}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => onFileSelect(event.target.files?.[0] || null)}
        />
        <p className="mt-2 text-[10px] text-muted-foreground">
          {maxSizeLabel} Supports {supportLabel}.
        </p>
      </div>
    </div>
  );
}
