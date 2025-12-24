'use client';

import { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LivePreviewFrameProps {
  url: string;
  className?: string;
  isHovered: boolean;
}

export function LivePreviewFrame({ url, className, isHovered }: LivePreviewFrameProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const shouldLoad = true;

  return (
    <div className={cn('relative w-full h-full bg-white', className)}>
      <div className="w-[400%] h-[400%] origin-top-left scale-25 select-none">
        <iframe
          src={url}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
          tabIndex={-1}
          loading="lazy"
          className="w-full h-full border-0 pointer-events-none bg-white"
          title="Live Preview"
        />
      </div>
      <div className="absolute inset-0 z-30 bg-transparent" />
    </div>
  );
}
