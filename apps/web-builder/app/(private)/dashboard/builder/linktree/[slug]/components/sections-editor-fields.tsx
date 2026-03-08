'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LinktreeFormValues } from '@/lib/schemas/linktree';
import { UseFormReturn } from 'react-hook-form';
import {
  FaDiscord,
  FaGithub,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaLink,
  FaGlobe,
} from 'react-icons/fa6';
import type { IconType } from 'react-icons';

export type SectionType = 'link' | 'promo' | 'support' | 'quote' | 'banner';
type IconKey = 'none' | 'tiktok' | 'youtube' | 'instagram' | 'discord' | 'portfolio' | 'github';

const LINK_ICON_OPTIONS: Array<{ key: IconKey; label: string; badgeClass: string; Icon: IconType }> = [
  { key: 'none', label: 'No Icon', badgeClass: 'bg-muted text-muted-foreground', Icon: FaLink },
  { key: 'tiktok', label: 'TikTok', badgeClass: 'bg-black text-white', Icon: FaTiktok },
  { key: 'youtube', label: 'YouTube', badgeClass: 'bg-red-500 text-white', Icon: FaYoutube },
  { key: 'instagram', label: 'Instagram', badgeClass: 'bg-yellow-300 text-black', Icon: FaInstagram },
  { key: 'discord', label: 'Discord', badgeClass: 'bg-blue-600 text-white', Icon: FaDiscord },
  { key: 'portfolio', label: 'Portfolio', badgeClass: 'bg-red-500 text-white', Icon: FaGlobe },
  { key: 'github', label: 'GitHub', badgeClass: 'bg-[#8b5e3c] text-white', Icon: FaGithub },
];

export function renderTypeFields({
  editIndex,
  type,
  register,
  setValue,
  watch,
}: {
  editIndex: number;
  type: SectionType;
  register: UseFormReturn<LinktreeFormValues>['register'];
  setValue: UseFormReturn<LinktreeFormValues>['setValue'];
  watch: UseFormReturn<LinktreeFormValues>['watch'];
}) {
  if (type === 'link') {
    const iconKey = (watch(`sections.${editIndex}.icon_key`) || 'none') as IconKey;
    const selectedIcon = LINK_ICON_OPTIONS.find((item) => item.key === iconKey) || LINK_ICON_OPTIONS[0];

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name / Title</Label>
            <Input {...register(`sections.${editIndex}.title`)} />
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input {...register(`sections.${editIndex}.url`)} placeholder="https://..." />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea rows={2} {...register(`sections.${editIndex}.description`)} />
        </div>
        <div className="space-y-2">
          <Label>Social Icon (Optional)</Label>
          <Select
            value={iconKey}
            onValueChange={(value) =>
              setValue(`sections.${editIndex}.icon_key`, value === 'none' ? '' : value, {
                shouldDirty: true,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose an icon" />
            </SelectTrigger>
            <SelectContent>
              {LINK_ICON_OPTIONS.map((option) => (
                <SelectItem key={option.key} value={option.key}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center text-[10px] font-bold ${option.badgeClass}`}
                    >
                      <option.Icon className="h-3.5 w-3.5" />
                    </span>
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            If an icon is selected, template display will prioritize this icon over uploaded image.
          </p>
          {iconKey !== 'none' ? (
            <div className="inline-flex items-center gap-2 rounded border px-2 py-1">
              <span
                className={`inline-flex h-6 w-6 items-center justify-center text-[10px] font-bold ${selectedIcon.badgeClass}`}
              >
                <selectedIcon.Icon className="h-4 w-4" />
              </span>
              <span className="text-xs text-muted-foreground">{selectedIcon.label}</span>
            </div>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label>Image Upload</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setValue(`sections.${editIndex}.image`, e.target.files?.[0] || null, {
                shouldDirty: true,
              })
            }
          />
        </div>
      </>
    );
  }

  if (type === 'promo') {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input {...register(`sections.${editIndex}.title`)} />
          </div>
          <div className="space-y-2">
            <Label>CTA Label</Label>
            <Input {...register(`sections.${editIndex}.cta_label`)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea rows={3} {...register(`sections.${editIndex}.description`)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Web URL</Label>
            <Input {...register(`sections.${editIndex}.url`)} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label>App URL</Label>
            <Input {...register(`sections.${editIndex}.app_url`)} placeholder="app://..." />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Image Upload</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setValue(`sections.${editIndex}.image`, e.target.files?.[0] || null)}
          />
        </div>
      </>
    );
  }

  if (type === 'support') {
    return (
      <>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input {...register(`sections.${editIndex}.title`)} />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea rows={2} {...register(`sections.${editIndex}.description`)} />
        </div>
        <div className="space-y-2">
          <Label>Support Note</Label>
          <Textarea rows={3} {...register(`sections.${editIndex}.support_note`)} />
        </div>
        <div className="space-y-2">
          <Label>Support QR Image Upload</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setValue(`sections.${editIndex}.support_qr_image`, e.target.files?.[0] || null)
            }
          />
        </div>
      </>
    );
  }

  if (type === 'quote') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Quote Text</Label>
          <Textarea rows={4} {...register(`sections.${editIndex}.quote_text`)} />
        </div>
        <div className="space-y-2">
          <Label>Quote Author</Label>
          <Input {...register(`sections.${editIndex}.quote_author`)} />
        </div>
      </div>
    );
  }

  if (type === 'banner') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Banner Text</Label>
          <Input {...register(`sections.${editIndex}.banner_text`)} />
        </div>
        <div className="space-y-2">
          <Label>Accent Color</Label>
          <Input {...register(`sections.${editIndex}.accent_color`)} placeholder="#ef4444" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded border border-dashed p-3 text-sm text-muted-foreground">
      Select a content type to configure its fields.
    </div>
  );
}
