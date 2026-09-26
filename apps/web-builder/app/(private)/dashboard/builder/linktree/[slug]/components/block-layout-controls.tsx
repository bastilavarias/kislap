'use client';

import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { LinktreeFormValues } from '@/lib/schemas/linktree';
import type { UseFormReturn } from 'react-hook-form';

const WIDTH_OPTIONS = [
  { value: 'auto', label: 'Auto', bar: 'w-8' },
  { value: 'full', label: 'Full', bar: 'w-full' },
  { value: 'two-thirds', label: '2/3', bar: 'w-2/3' },
  { value: 'half', label: '1/2', bar: 'w-1/2' },
  { value: 'third', label: '1/3', bar: 'w-1/3' },
] as const;

const ALIGN_OPTIONS = [
  { value: 'left', label: 'Left', icon: AlignLeft },
  { value: 'center', label: 'Center', icon: AlignCenter },
  { value: 'right', label: 'Right', icon: AlignRight },
] as const;

const VARIANT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'card', label: 'Card' },
  { value: 'flat', label: 'Flat' },
  { value: 'highlight', label: 'Highlight' },
] as const;

const PADDING_OPTIONS = [
  { value: 'compact', label: 'Compact' },
  { value: 'normal', label: 'Normal' },
  { value: 'spacious', label: 'Spacious' },
] as const;

type Props = {
  index: number;
  watch: UseFormReturn<LinktreeFormValues>['watch'];
  setValue: UseFormReturn<LinktreeFormValues>['setValue'];
};

function optionClass(selected: boolean) {
  return cn(
    'border-2 border-black bg-background text-foreground transition',
    'hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#000]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    selected && 'bg-secondary shadow-[3px_3px_0_#000]',
  );
}

export function BlockLayoutControls({ index, watch, setValue }: Props) {
  const width = watch(`sections.${index}.layout.width`) || 'auto';
  const align = watch(`sections.${index}.layout.align`) || 'left';
  const variant = watch(`sections.${index}.style.variant`) || 'default';
  const padding = watch(`sections.${index}.style.padding`) || 'normal';

  return (
    <div className="border-t-2 border-black pt-5">
      <div className="mb-4">
        <p className="font-black uppercase">Block layout</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Set this block&apos;s size and presentation. Mobile stacks blocks automatically.
        </p>
      </div>

      <div className="space-y-5 border-2 border-black bg-muted/20 p-4">
        <div className="space-y-2.5">
          <Label className="font-black uppercase tracking-wide">Width</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {WIDTH_OPTIONS.map((option) => {
              const selected = width === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    setValue(`sections.${index}.layout.width`, option.value as any, {
                      shouldDirty: true,
                    })
                  }
                  className={cn(optionClass(selected), 'min-h-14 px-3 py-2')}
                >
                  <span className="block text-xs font-black uppercase">{option.label}</span>
                  <span className="mt-2 flex h-2 items-center justify-center">
                    <span className={cn('block h-1.5 bg-current', option.bar)} />
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Auto follows the selected page layout. Manual widths override it for this block.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2.5">
            <Label className="font-black uppercase tracking-wide">Alignment</Label>
            <div className="grid grid-cols-3 gap-2">
              {ALIGN_OPTIONS.map((option) => {
                const Icon = option.icon;
                const selected = align === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-label={option.label}
                    aria-pressed={selected}
                    onClick={() =>
                      setValue(`sections.${index}.layout.align`, option.value as any, {
                        shouldDirty: true,
                      })
                    }
                    className={cn(
                      optionClass(selected),
                      'flex h-10 items-center justify-center gap-2 px-2',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden text-xs font-bold sm:inline">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2.5">
            <Label className="font-black uppercase tracking-wide">Spacing</Label>
            <div className="grid grid-cols-3 gap-2">
              {PADDING_OPTIONS.map((option) => {
                const selected = padding === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setValue(`sections.${index}.style.padding`, option.value as any, {
                        shouldDirty: true,
                      })
                    }
                    className={cn(optionClass(selected), 'h-10 px-2 text-xs font-bold')}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <Label className="font-black uppercase tracking-wide">Appearance</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {VARIANT_OPTIONS.map((option) => {
              const selected = variant === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    setValue(`sections.${index}.style.variant`, option.value as any, {
                      shouldDirty: true,
                    })
                  }
                  className={cn(optionClass(selected), 'h-10 px-3 text-xs font-bold uppercase')}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
