'use client';

import { useMemo, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MenuFormValues } from '@/lib/schemas/menu';
import { ImageUploadField } from '../image-upload-field';
import { VariantsEditor } from './variants-editor';

interface Props {
  formMethods: UseFormReturn<MenuFormValues>;
  fieldArray: UseFieldArrayReturn<MenuFormValues, 'items', 'id'>;
}

export function ItemsEditor({ formMethods, fieldArray }: Props) {
  const { register, setValue, watch, control } = formMethods;
  const { fields, move, remove } = fieldArray;
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const categories = watch('categories') || [];

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.client_key,
        label: category.name || 'Untitled category',
      })),
    [categories]
  );

  const addItem = () => {
    fieldArray.append({
      name: '',
      price: '',
      description: '',
      category_key: categories[0]?.client_key || '',
      image: null,
      image_url: '',
      badge: '',
      variants: [],
      placement_order: fields.length,
      is_available: true,
      is_featured: false,
    });
    setTimeout(() => setEditIndex(fields.length), 0);
  };

  return (
    <>
      <div className="space-y-3">
        {fields.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed bg-muted/20 py-6 text-center text-muted-foreground">
            <LayoutTemplate className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p>No items yet.</p>
          </div>
        ) : (
          <SortableList
            items={fields}
            onDragEnd={(oldIndex, newIndex) => move(oldIndex, newIndex)}
            renderItem={(field, index) => {
              const name = watch(`items.${index}.name`);
              const price = watch(`items.${index}.price`);
              const categoryKey = watch(`items.${index}.category_key`);
              const variants = watch(`items.${index}.variants`) || [];
              const categoryLabel =
                categoryOptions.find((category) => category.value === categoryKey)?.label ||
                'Uncategorized';
              const defaultVariant = variants.find((variant) => variant.is_default) || variants[0];
              const priceLabel = variants.length
                ? `Starts at ${defaultVariant?.price || price}`
                : price;

              return (
                <div className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-muted/30">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{name || 'Untitled item'}</p>
                    <p className="text-xs text-muted-foreground">
                      {categoryLabel}
                      {priceLabel ? ` | ${priceLabel}` : ''}
                      {variants.length ? ` | ${variants.length} variants` : ''}
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

        <Button type="button" variant="outline" className="w-full border-dashed shadow-none" onClick={addItem}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <Dialog open={editIndex !== null} onOpenChange={(open) => !open && setEditIndex(null)}>
        <DialogContent className="sm:max-w-[780px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editIndex === null ? 'Item' : 'Edit Item'}</DialogTitle>
            <DialogDescription>
              Use a base price for simple items, or add flexible variants for sizes and drink types.
            </DialogDescription>
          </DialogHeader>

          {editIndex !== null && (
            <div className="grid items-start gap-6 py-4 md:grid-cols-[1fr_220px]">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="mb-2 block">Name</Label>
                    <Input
                      {...register(`items.${editIndex}.name`)}
                      placeholder="Margherita"
                      className="shadow-none"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Base / Starting Price</Label>
                    <Input
                      {...register(`items.${editIndex}.price`)}
                      placeholder="PHP 480"
                      className="shadow-none"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Category</Label>
                  <Controller
                    name={`items.${editIndex}.category_key`}
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value || ''} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full shadow-none">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Description</Label>
                  <Input
                    {...register(`items.${editIndex}.description`)}
                    placeholder="San Marzano tomatoes, fior di latte, basil."
                    className="shadow-none"
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Badge</Label>
                  <Input
                    {...register(`items.${editIndex}.badge`)}
                    placeholder="Bestseller"
                    className="shadow-none"
                  />
                </div>

                <VariantsEditor formMethods={formMethods} itemIndex={editIndex} />

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium">Available</span>
                      <Controller
                        name={`items.${editIndex}.is_available`}
                        control={control}
                        render={({ field }) => (
                          <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                        )}
                      />
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium">Featured</span>
                      <Controller
                        name={`items.${editIndex}.is_featured`}
                        control={control}
                        render={({ field }) => (
                          <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="self-start rounded-lg border bg-muted/20 p-4">
                <Label className="mb-3 block text-sm font-medium">Item Image</Label>
                <ImageUploadField
                  id={`item-image-${editIndex}`}
                  previewUrl={watch(`items.${editIndex}.image_url`)}
                  currentFile={watch(`items.${editIndex}.image`) as File}
                  onFileSelect={(file) =>
                    setValue(`items.${editIndex}.image`, file, { shouldDirty: true })
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

