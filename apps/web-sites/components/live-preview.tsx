'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveFrameProps {
  url: string;
  className?: string;
}

export function LiveFrame({ url, className }: LiveFrameProps) {
  const [isLoading, setIsLoading] = useState(true);
  const VIEWPORT_WIDTH = 1280;
  const VIEWPORT_HEIGHT = 800;

  return (
    <div className={cn('relative w-full h-full bg-muted/10 overflow-hidden', className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      <div className="absolute inset-0 w-full h-full">
        <iframe
          src={url}
          onLoad={() => setIsLoading(false)}
          tabIndex={-1}
          className="absolute top-0 left-0 border-0 pointer-events-none origin-top-left bg-white"
          style={{
            width: `${VIEWPORT_WIDTH}px`,
            height: `${VIEWPORT_HEIGHT}px`,
            transform: 'scale(var(--scale-factor))',
          }}
        />
      </div>
    </div>
  );
}
