'use client';

import { Controller, UseFieldArrayReturn, UseFormReturn, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MenuFormValues } from '@/lib/schemas/menu';

interface Props {
  formMethods: UseFormReturn<MenuFormValues>;
  itemIndex: number;
}

export function VariantsEditor({ formMethods, itemIndex }: Props) {
  const { control, register, watch, setValue } = formMethods;
  const fieldArray = useFieldArray({
    control,
    name: `items.${itemIndex}.variants` as const,
  });

  const { fields, append, remove } = fieldArray;

  const addVariant = () => {
    append({
      name: '',
      price: '',
      is_default: fields.length === 0,
      placement_order: fields.length,
    });
  };

  const setDefaultVariant = (variantIndex: number, isDefault: boolean) => {
    if (!isDefault) {
      setValue(`items.${itemIndex}.variants.${variantIndex}.is_default`, false, {
        shouldDirty: true,
      });
      return;
    }

    fields.forEach((_, index) => {
      setValue(`items.${itemIndex}.variants.${index}.is_default`, index === variantIndex, {
        shouldDirty: true,
      });
    });
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <Label className="text-sm font-medium">Variants & Sizes</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Add flexible options like 12oz, 16oz, Hot, or Iced.
          </p>
        </div>
        <Button type="button" size="sm" variant="outline" className="shadow-none" onClick={addVariant}>
          <Plus className="mr-2 h-4 w-4" />
          Add Variant
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-md border border-dashed bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
          No variants yet. Use the base price above, or add variant rows for sizes.
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, variantIndex) => {
            const variantName = watch(`items.${itemIndex}.variants.${variantIndex}.name`);

            return (
              <div key={field.id} className="rounded-lg border bg-muted/20 p-3">
                <div className="grid gap-3 md:grid-cols-[1fr_140px_120px_auto] md:items-end">
                  <div>
                    <Label className="mb-2 block">Variant Name</Label>
                    <Input
                      {...register(`items.${itemIndex}.variants.${variantIndex}.name`)}
                      placeholder="12oz"
                      className="shadow-none"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Price</Label>
                    <Input
                      {...register(`items.${itemIndex}.variants.${variantIndex}.price`)}
                      placeholder="₱120"
                      className="shadow-none"
                    />
                  </div>
                  <div className="rounded-lg border bg-background p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium">Default</span>
                      <Controller
                        name={`items.${itemIndex}.variants.${variantIndex}.is_default`}
                        control={control}
                        render={({ field: switchField }) => (
                          <Switch
                            checked={!!switchField.value}
                            onCheckedChange={(checked) => {
                              switchField.onChange(checked);
                              setDefaultVariant(variantIndex, checked);
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 self-end text-muted-foreground hover:text-destructive"
                    onClick={() => remove(variantIndex)}
                    aria-label={`Remove ${variantName || 'variant'}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
