'use client';

import { useEffect, useState } from 'react';
import { Image as ImageIcon, Plus, X } from 'lucide-react';

interface GalleryUploaderProps {
  files: (File | null | undefined)[];
  urls: (string | null | undefined)[];
  onChange: (items: Array<{ image: File | null; image_url: string | null }>) => void;
  maxFiles?: number;
}

interface DisplayItem {
  src: string;
  file: File | null;
  url: string | null;
}

export function GalleryUploader({
  files,
  urls,
  onChange,
  maxFiles = 8,
}: GalleryUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const objectUrls = files
      .filter((file): file is File => file instanceof File)
      .map((file) => URL.createObjectURL(file));

    setPreviews(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const displayItems: DisplayItem[] = files
    .map((file, index) => {
      const filePreviewIndex = files
        .slice(0, index + 1)
        .filter((entry): entry is File => entry instanceof File).length - 1;

      return {
        src: file instanceof File ? previews[filePreviewIndex] || '' : urls[index] || '',
        file: file instanceof File ? file : null,
        url: file instanceof File ? null : urls[index] || null,
      };
    })
    .filter((item) => item.src);

  const handleAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;

    const currentItems = displayItems.map((item) => ({
      image: item.file,
      image_url: item.url,
    }));

    const nextItems = [
      ...currentItems,
      ...selectedFiles.map((file) => ({ image: file, image_url: null })),
    ].slice(0, maxFiles);

    onChange(nextItems);
    event.target.value = '';
  };

  const handleRemove = (index: number) => {
    const nextItems = displayItems
      .filter((_, itemIndex) => itemIndex !== index)
      .map((item) => ({
        image: item.file,
        image_url: item.url,
      }));

    onChange(nextItems);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {displayItems.map((item, index) => (
          <div
            key={`${item.src}-${index}`}
            className="group relative aspect-square overflow-hidden rounded-xl border bg-muted"
          >
            <img src={item.src} alt={`Gallery ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute right-2 top-2 rounded-full bg-background/90 p-1.5 text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {displayItems.length < maxFiles ? (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 text-center transition-colors hover:bg-muted/40">
            <Plus className="mb-2 h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Add Image</span>
            <span className="mt-1 px-3 text-[10px] text-muted-foreground">
              PNG, JPG, WEBP
            </span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleAdd} />
          </label>
        ) : null}
      </div>

      {!displayItems.length ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ImageIcon className="h-4 w-4" />
          Add gallery photos to make the menu page feel more alive.
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          {displayItems.length} / {maxFiles} images
        </p>
      )}
    </div>
  );
}
