'use client';

import { UseFormReturn } from 'react-hook-form';
import { Globe2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MenuFormValues } from '@/lib/schemas/menu';

interface Props {
  formMethods: UseFormReturn<MenuFormValues>;
}

function toLabel(platform: string) {
  switch (platform) {
    case 'google-reviews':
      return 'Google Reviews';
    case 'tripadvisor':
      return 'TripAdvisor';
    default:
      return platform.charAt(0).toUpperCase() + platform.slice(1);
  }
}

export function SocialLinksEditor({ formMethods }: Props) {
  const { watch, register } = formMethods;
  const socialLinks = watch('social_links') || [];

  return (
    <div className="space-y-4 rounded-lg border bg-muted/10 p-4">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
          <Globe2 className="h-4 w-4" />
          Social & Reviews
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Add the links customers are most likely to open from your menu.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {socialLinks.map((link, index) => (
          <div key={link.platform}>
            <Label className="mb-2 block">{toLabel(link.platform)}</Label>
            <Input
              {...register(`social_links.${index}.url`)}
              placeholder={`https://${link.platform}.com/...`}
              className="shadow-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
