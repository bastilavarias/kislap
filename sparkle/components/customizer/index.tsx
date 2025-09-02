'use client';

import React from 'react';
import { Palette, X } from 'lucide-react';
import ThemeControlPanel from './ThemeControlPanel';
import { RainbowButton } from '@/components/ui/rainbow-button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ThemeCustomizer({ open, setOpen }: Props) {
  return (
    <Sheet open={open} modal={false}>
      <SheetTrigger asChild onClick={() => setOpen(true)}>
        <RainbowButton
          className="cursor-pointer"
          aria-label="Theme customizer"
          data-tour="theme-customizer"
        >
          <Palette className="h-4 w-4" />
        </RainbowButton>
      </SheetTrigger>
      <SheetContent className="h-full w-full gap-0 sm:max-w-[400px] [&>button]:hidden">
        <SheetHeader className="min-h-(--header-height) flex-row items-center justify-between border-b border-dashed px-6">
          <SheetTitle>Theme Customizer</SheetTitle>
          <SheetClose
            className="hover:bg-muted flex size-7 cursor-pointer items-center justify-center rounded transition-colors"
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
          </SheetClose>
        </SheetHeader>
        <ThemeControlPanel />
      </SheetContent>
    </Sheet>
  );
}
