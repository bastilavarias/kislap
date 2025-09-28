'use client';

import type React from 'react';

import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';

interface DropzoneProps {
  onDrop: (files: File[]) => void;
  onError?: (error: string) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  minSize?: number;
  className?: string;
  children: React.ReactNode;
  src?: File[];
}

export function Dropzone({
  onDrop,
  onError,
  accept,
  maxFiles = 1,
  maxSize,
  minSize,
  className,
  children,
  src = [],
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFiles = useCallback(
    (files: File[]) => {
      const validFiles: File[] = [];

      for (const file of files) {
        // Check file type
        if (accept) {
          const acceptedTypes = Object.keys(accept);
          const isValidType = acceptedTypes.some((type) => {
            if (type.includes('*')) {
              const baseType = type.split('/')[0];
              return file.type.startsWith(baseType);
            }
            return file.type === type;
          });

          if (!isValidType) {
            onError?.(`File type ${file.type} is not accepted`);
            continue;
          }
        }

        // Check file size
        if (maxSize && file.size > maxSize) {
          onError?.(`File size exceeds ${maxSize} bytes`);
          continue;
        }

        if (minSize && file.size < minSize) {
          onError?.(`File size is below ${minSize} bytes`);
          continue;
        }

        validFiles.push(file);
      }

      // Check max files
      if (maxFiles && validFiles.length > maxFiles) {
        onError?.(`Maximum ${maxFiles} files allowed`);
        return validFiles.slice(0, maxFiles);
      }

      return validFiles;
    },
    [accept, maxFiles, maxSize, minSize, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const validFiles = validateFiles(files);

      if (validFiles.length > 0) {
        onDrop(validFiles);
      }
    },
    [onDrop, validateFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const validFiles = validateFiles(files);

      if (validFiles.length > 0) {
        onDrop(validFiles);
      }

      // Reset input
      e.target.value = '';
    },
    [onDrop, validateFiles]
  );

  const acceptString = accept ? Object.keys(accept).join(',') : undefined;

  return (
    <div
      className={cn(
        'relative border-2 border-dashed rounded-lg transition-colors cursor-pointer',
        isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
        className
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input
        id="file-input"
        type="file"
        className="sr-only"
        accept={acceptString}
        multiple={maxFiles !== 1}
        onChange={handleFileInput}
      />
      {children}
    </div>
  );
}

export function DropzoneEmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">{children}</div>
  );
}

export function DropzoneContent({ files }: { files?: File[] }) {
  if (!files || files.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      {files.map((file, index) => (
        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
          <span className="truncate">{file.name}</span>
          <span className="text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
        </div>
      ))}
    </div>
  );
}
