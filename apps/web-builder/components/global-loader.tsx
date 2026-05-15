import Image from 'next/image';
import React from 'react';

export function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div role="status" className="select-none">
        <Image
          src="/logo-transparent.png"
          alt=""
          width={3919}
          height={3919}
          priority
          className="h-28 w-28 animate-pulse object-contain drop-shadow-[0_0_25px_rgba(255,49,50,0.35)]"
        />
        <span className="sr-only">Loading Kislap...</span>
      </div>
    </div>
  );
}
