'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { LinktreeFormValues } from '@/lib/schemas/linktree';
import type { UseFormReturn } from 'react-hook-form';

const WIDTH_OPTIONS = [
  { value: 'auto', label: 'Auto', description: 'Follow the selected page layout.' },
  { value: 'full', label: 'Full', description: 'Use the full content row.' },
  { value: 'two-thirds', label: '2/3', description: 'Wide block with room beside it.' },
  { value: 'half', label: 'Half', description: 'Pair cleanly with another half block.' },
  { value: 'third', label: '1/3', description: 'Compact supporting block.' },
] as const;

const ALIGN_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
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

export function BlockLayoutControls({ index, watch, setValue }: Props) {
  const width = watch(`sections.${index}.layout.width`) || 'auto';
  const align = watch(`sections.${index}.layout.align`) || 'left';
  const variant = watch(`sections.${index}.style.variant`) || 'default';
  const padding = watch(`sections.${index}.style.padding`) || 'normal';

  return (
    <div className="border-t-2 border-black pt-4">
      <div className="mb-3">
        <p className="font-black uppercase">Block layout</p>
        <p className="text-xs text-muted-foreground">
          Control how this block participates in the page grid. Mobile automatically stacks blocks.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Width</Label>
          <Select
            value={width}
            onValueChange={(value) =>
              setValue(`sections.${index}.layout.width`, value as any, { shouldDirty: true })
            }
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {WIDTH_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <p className="font-semibold">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Alignment</Label>
          <Select
            value={align}
            onValueChange={(value) =>
              setValue(`sections.${index}.layout.align`, value as any, { shouldDirty: true })
            }
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ALIGN_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Appearance</Label>
          <Select
            value={variant}
            onValueChange={(value) =>
              setValue(`sections.${index}.style.variant`, value as any, { shouldDirty: true })
            }
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {VARIANT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Spacing</Label>
          <Select
            value={padding}
            onValueChange={(value) =>
              setValue(`sections.${index}.style.padding`, value as any, { shouldDirty: true })
            }
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PADDING_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
