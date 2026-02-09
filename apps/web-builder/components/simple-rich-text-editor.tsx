'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { BoldIcon, StrikethroughIcon, LinkIcon, ListIcon } from 'lucide-react';

interface SimpleRichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
}

export function SimpleRichTextEditor({
  value,
  onChange,
  className,
  placeholder = 'Type content here...',
}: SimpleRichTextEditorProps) {
  const insertFormat = (format: 'bold' | 'list' | 'link' | 'strike') => {
    let newText = value || '';

    // Note: This appends to the end.
    // If you want to insert at cursor, you'd need a ref to the Textarea.
    if (format === 'bold') newText += ' **bold text** ';
    if (format === 'strike') newText += ' ~~strikethrough~~ ';
    if (format === 'link') newText += ' [link text](https://example.com) ';
    if (format === 'list') newText += '\n- list item';

    onChange(newText);
  };

  return (
    <div
      className={cn(
        'border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring',
        className
      )}
    >
      <div className="bg-muted/50 border-b p-2 flex gap-1 flex-wrap items-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertFormat('bold')}
          title="Bold"
        >
          <BoldIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertFormat('strike')}
          title="Strikethrough"
        >
          <StrikethroughIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertFormat('link')}
          title="Link"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertFormat('list')}
          title="List"
        >
          <ListIcon className="w-4 h-4" />
        </Button>

        <span className="text-[10px] text-muted-foreground ml-auto px-2">Markdown Supported</span>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-none shadow-none focus-visible:ring-0 rounded-none min-h-[100px] resize-none font-mono text-sm"
        placeholder={placeholder}
      />
    </div>
  );
}
