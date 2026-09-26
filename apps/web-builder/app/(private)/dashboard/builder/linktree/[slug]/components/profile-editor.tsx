'use client';

import { Controller, type UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SimpleRichTextEditor } from '@/components/simple-rich-text-editor';
import type { LinktreeFormValues } from '@/lib/schemas/linktree';
import { ImageUploadField } from './image-upload-field';

type Props = {
  formMethods: UseFormReturn<LinktreeFormValues>;
};

export function ProfileEditor({ formMethods }: Props) {
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = formMethods;

  return (
    <section className="border-2 border-black bg-card p-4">
      <div className="mb-4">
        <p className="font-black uppercase">Profile</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Your identity stays visible at the top of the page while you edit.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-[104px_minmax(0,1fr)]">
        <div>
          <Label className="mb-2 block">Photo / Logo</Label>
          <ImageUploadField
            id="logo-upload"
            previewUrl={watch('logo_url')}
            currentFile={watch('logo') as File}
            onFileSelect={(file) => setValue('logo', file, { shouldDirty: true })}
          />
        </div>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Name</Label>
            <Input {...register('name')} placeholder="Your name" className="shadow-none" />
            {errors.name ? (
              <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div>
            <Label className="mb-2 block">Tagline</Label>
            <Input
              {...register('tagline')}
              placeholder="What do you do?"
              className="shadow-none"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-2 block">Phone</Label>
              <Input {...register('phone')} placeholder="09xx xxx xxxx" className="shadow-none" />
            </div>
            <div>
              <Label className="mb-2 block">Email</Label>
              <Input {...register('email')} placeholder="you@email.com" className="shadow-none" />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">About</Label>
            <Controller
              control={control}
              name="about"
              render={({ field }) => (
                <SimpleRichTextEditor
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder="A short intro about you..."
                />
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
