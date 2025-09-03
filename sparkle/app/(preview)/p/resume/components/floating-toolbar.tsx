'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Palette, Type, Layout, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FloatingToolbar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const customizationOptions = [
    { icon: Palette, label: 'Themes', action: () => console.log('Colors') },
    { icon: Layout, label: 'Layout', action: () => console.log('Layout') },
  ];

  return (
    <div className="fixed bottom-0 right-0 m-5">
      <div
        className={cn(
          'flex flex-col gap-2 mb-4 transition-all duration-300 ease-in-out',
          isExpanded
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        {customizationOptions.map((option, index) => (
          <Button
            key={option.label}
            variant="outline"
            size="icon"
            className={cn(
              'w-12 h-12 rounded-full shadow-lg border transition-all duration-200',
              'hover:scale-110 hover:shadow-xl',
              'transform',
              isExpanded ? 'scale-100' : 'scale-0'
            )}
            style={{
              transitionDelay: isExpanded ? `${index * 50}ms` : '0ms',
            }}
            onClick={option.action}
          >
            <option.icon className="w-5 h-5" />
            <span className="sr-only">{option.label}</span>
          </Button>
        ))}
      </div>

      <Button
        variant="default"
        size="icon"
        className={cn(
          'w-14 h-14 rounded-full shadow-xl border-2 border-background',
          'hover:scale-110 transition-all duration-200',
          'bg-primary hover:bg-primary/90',
          isExpanded && 'rotate-45'
        )}
        onClick={toggleExpanded}
      >
        <Settings className="w-6 h-6" />
        <span className="sr-only">Customize Preview</span>
      </Button>
    </div>
  );
}
