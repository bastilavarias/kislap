'use client';

import { useState } from 'react';
import { Controller, UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { LinktreeFormValues } from '@/lib/schemas/linktree';
import { SortableList } from '@/components/sortable-list';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, LayoutTemplate } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { renderTypeFields, SectionType } from './sections-editor-fields';

const SECTION_TYPES = [
  { id: 'link', label: 'Link' },
  { id: 'promo', label: 'Promo Card' },
  { id: 'support', label: 'Support Card' },
  { id: 'quote', label: 'Quote Card' },
  { id: 'banner', label: 'Banner Card' },
] as const;

function typeLabel(type?: string) {
  return SECTION_TYPES.find((item) => item.id === type)?.label || 'Section';
}

interface Props {
  formMethods: UseFormReturn<LinktreeFormValues>;
  sectionsFieldArray: UseFieldArrayReturn<LinktreeFormValues, 'sections', 'id'>;
  onAddSection: () => void;
}

export function SectionsEditor({ formMethods, sectionsFieldArray, onAddSection }: Props) {
  const { watch, setValue, register, control } = formMethods;
  const { fields, move, remove } = sectionsFieldArray;
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const addAndEdit = () => {
    onAddSection();
    setTimeout(() => setEditIndex(fields.length), 0);
  };

  return (
    <>
      <div className="space-y-3">
        {fields.length === 0 ? (
          <div className="border-2 border-dashed border-black bg-secondary/40 py-6 text-center text-black">
            <LayoutTemplate className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-black uppercase">No content items yet.</p>
          </div>
        ) : (
          <SortableList
            items={fields}
            onDragEnd={(oldIndex, newIndex) => {
              move(oldIndex, newIndex);
            }}
            renderItem={(field, index) => {
              const type = watch(`sections.${index}.type`);
              const title = watch(`sections.${index}.title`);
              const url = watch(`sections.${index}.url`);
              const bannerText = watch(`sections.${index}.banner_text`);
              const quoteText = watch(`sections.${index}.quote_text`);

              const displayTitle = title || bannerText || quoteText || 'Untitled Section';

              return (
                <div className="flex items-center justify-between border-2 border-black bg-card p-3 transition-colors hover:bg-secondary/40">
                  <div className="min-w-0">
                    <p className="truncate font-black uppercase">{displayTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {type === 'link' && url ? `${typeLabel(type)} - ${url}` : typeLabel(type)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setEditIndex(index)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            }}
          />
        )}

        <Button onClick={addAndEdit} variant="outline" className="w-full border-dashed">
          <Plus className="w-4 h-4 mr-2" /> Add Content Item
        </Button>
      </div>

      <Dialog open={editIndex !== null} onOpenChange={(open) => !open && setEditIndex(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Content Item</DialogTitle>
            <DialogDescription>Only fields relevant to the selected type are shown.</DialogDescription>
          </DialogHeader>

          {editIndex !== null && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Section Type</Label>
                <Controller
                  name={`sections.${editIndex}.type`}
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose section type" />
                      </SelectTrigger>
                      <SelectContent>
                        {SECTION_TYPES.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {renderTypeFields({
                editIndex,
                type: watch(`sections.${editIndex}.type`) as SectionType,
                register,
                setValue,
                watch,
              })}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setEditIndex(null)} className="w-full sm:w-auto">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
