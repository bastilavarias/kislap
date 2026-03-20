'use client';

import { useState } from 'react';
import { Controller, UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { Edit2, LayoutTemplate, Plus, Trash2 } from 'lucide-react';
import { SortableList } from '@/components/sortable-list';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { MenuFormValues } from '@/lib/schemas/menu';
import { ImageUploadField } from './image-upload-field';

interface Props {
  formMethods: UseFormReturn<MenuFormValues>;
  fieldArray: UseFieldArrayReturn<MenuFormValues, 'categories', 'id'>;
}

export function CategoriesEditor({ formMethods, fieldArray }: Props) {
  const { register, setValue, watch, control } = formMethods;
  const { fields, move, remove } = fieldArray;
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const addCategory = () => {
    fieldArray.append({
      client_key: `category-${crypto.randomUUID()}`,
      name: '',
      description: '',
      image: null,
      image_url: '',
      placement_order: fields.length,
      is_visible: true,
    });
    setTimeout(() => setEditIndex(fields.length), 0);
  };

  return (
    <>
      <div className="space-y-3">
        {fields.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed bg-muted/20 py-6 text-center text-muted-foreground">
            <LayoutTemplate className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p>No categories yet.</p>
          </div>
        ) : (
          <SortableList
            items={fields}
            onDragEnd={(oldIndex, newIndex) => move(oldIndex, newIndex)}
            renderItem={(field, index) => {
              const name = watch(`categories.${index}.name`);
              const description = watch(`categories.${index}.description`);
              const isVisible = watch(`categories.${index}.is_visible`);

              return (
                <div className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-muted/30">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{name || 'Untitled category'}</p>
                    <p className="text-xs text-muted-foreground">
                      {isVisible ? 'Visible' : 'Hidden'}
                      {description ? ` • ${description}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setEditIndex(index)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            }}
          />
        )}

        <Button type="button" variant="outline" className="w-full border-dashed shadow-none" onClick={addCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Dialog open={editIndex !== null} onOpenChange={(open) => !open && setEditIndex(null)}>
        <DialogContent className="sm:max-w-[680px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editIndex === null ? 'Category' : 'Edit Category'}</DialogTitle>
            <DialogDescription>Update the category details shown on the menu.</DialogDescription>
          </DialogHeader>

          {editIndex !== null && (
            <div className="grid gap-6 py-4 md:grid-cols-[1fr_220px]">
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Name</Label>
                  <Input
                    {...register(`categories.${editIndex}.name`)}
                    placeholder="Pizza"
                    className="shadow-none"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Description</Label>
                  <Input
                    {...register(`categories.${editIndex}.description`)}
                    placeholder="Wood-fired classics and house specials."
                    className="shadow-none"
                  />
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Visible on menu</p>
                      <p className="text-xs text-muted-foreground">
                        Hide a category without deleting it.
                      </p>
                    </div>
                    <Controller
                      name={`categories.${editIndex}.is_visible`}
                      control={control}
                      render={({ field }) => (
                        <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/20 p-4">
                <Label className="mb-3 block text-sm font-medium">Category Image</Label>
                <ImageUploadField
                  id={`category-image-${editIndex}`}
                  previewUrl={watch(`categories.${editIndex}.image_url`)}
                  currentFile={watch(`categories.${editIndex}.image`) as File}
                  onFileSelect={(file) =>
                    setValue(`categories.${editIndex}.image`, file, { shouldDirty: true })
                  }
                  orientation="vertical"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" onClick={() => setEditIndex(null)} className="w-full sm:w-auto">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
