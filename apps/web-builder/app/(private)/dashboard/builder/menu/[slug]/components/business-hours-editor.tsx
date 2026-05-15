'use client';

import { UseFormReturn } from 'react-hook-form';
import { Clock3 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { MenuFormValues } from '@/lib/schemas/menu';

interface Props {
  formMethods: UseFormReturn<MenuFormValues>;
}

export function BusinessHoursEditor({ formMethods }: Props) {
  const { watch, setValue, register } = formMethods;
  const hoursEnabled = watch('hours_enabled');
  const businessHours = watch('business_hours') || [];

  return (
    <div className="space-y-4 border-2 border-black bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-primary">
            <Clock3 className="h-4 w-4" />
            Opening Hours
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Show your schedule on the public menu.
          </p>
        </div>
        <Switch
          checked={hoursEnabled}
          onCheckedChange={(checked) => setValue('hours_enabled', checked, { shouldDirty: true })}
        />
      </div>

      {hoursEnabled ? (
        <div className="space-y-3">
          {businessHours.map((entry, index) => {
            const isClosed = watch(`business_hours.${index}.closed`);

            return (
              <div
                key={entry.day}
                className="grid gap-3 border-2 border-black bg-background p-3 md:grid-cols-[140px_1fr_1fr_auto]"
              >
                <div className="flex items-center">
                  <Label className="text-sm font-black uppercase">{entry.day}</Label>
                </div>
                <Input
                  type="time"
                  {...register(`business_hours.${index}.open`)}
                  disabled={isClosed}
                  className="shadow-none"
                />
                <Input
                  type="time"
                  {...register(`business_hours.${index}.close`)}
                  disabled={isClosed}
                  className="shadow-none"
                />
                <div className="flex items-center justify-between gap-3 border-2 border-black px-3 py-2 md:justify-center">
                  <span className="text-sm text-muted-foreground">Closed</span>
                  <Switch
                    checked={isClosed}
                    onCheckedChange={(checked) =>
                      setValue(`business_hours.${index}.closed`, checked, { shouldDirty: true })
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
