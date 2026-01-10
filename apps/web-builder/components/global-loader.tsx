import React from 'react';

export function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div
        role="status"
        className="animate-pulse text-[150px] leading-none select-none filter drop-shadow-[0_0_25px_rgba(234,179,8,0.5)]"
      >
        ✨<span className="sr-only">Loading Kislap...</span>
      </div>
    </div>
  );
}
