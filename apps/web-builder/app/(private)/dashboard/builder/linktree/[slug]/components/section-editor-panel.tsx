'use client';

import { Controller, type UseFormReturn } from 'react-hook-form';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { LinktreeFormValues } from '@/lib/schemas/linktree';
import { BlockLayoutControls } from './block-layout-controls';
import { renderTypeFields, type SectionType } from './sections-editor-fields';
import { SECTION_TYPES, typeLabel } from './section-type-options';

type Props = {
  index: number;
  formMethods: UseFormReturn<LinktreeFormValues>;
  onDone: () => void;
};

export function SectionEditorPanel({ index, formMethods, onDone }: Props) {
  const { watch, setValue, register, control } = formMethods;
  const type = watch(`sections.${index}.type`) as SectionType;

  return (
    <div className="border-2 border-black bg-background shadow-[4px_4px_0_#000]">
      <div className="flex items-start justify-between gap-4 border-b-2 border-black bg-secondary px-4 py-3">
        <div>
          <p className="font-black uppercase">Edit {typeLabel(type)}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Changes appear in the preview immediately.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 border-2 border-black bg-background"
          onClick={onDone}
          aria-label="Close block editor"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-5 p-4">
        <div className="space-y-2">
          <Label className="font-black uppercase tracking-wide">Block type</Label>
          <Controller
            name={`sections.${index}.type`}
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose block type" />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_TYPES.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {renderTypeFields({
          editIndex: index,
          type,
          register,
          setValue,
          watch,
        })}

        <BlockLayoutControls index={index} watch={watch} setValue={setValue} />

        <div className="flex justify-end border-t-2 border-black pt-4">
          <Button type="button" onClick={onDone}>
            Done editing
          </Button>
        </div>
      </div>
    </div>
  );
}
