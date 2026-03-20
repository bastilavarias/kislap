'use client';

import { ReactNode } from 'react';
import { BackButton } from '@/components/back-button';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { FormHeader } from './components/form-header';
import { MenuProvider, useMenuBuilder } from './components/menu-provider';

function BuilderLayoutContent({ children }: { children: ReactNode }) {
  const {
    project,
    previewValues,
    layout,
    localThemeSettings,
    save,
    publish,
    isLoading,
    hasContent,
    hasCategories,
    hasItems,
    hasLayout,
    hasTheme,
  } = useMenuBuilder();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size={50} />
      </div>
    );
  }

  return (
    <div>
      <BackButton to="/dashboard" className="mb-5" icon={true}>
        Go back
      </BackButton>
      <div className="flex flex-col gap-10">
        <FormHeader
          project={project}
          previewValues={previewValues}
          layout={layout}
          themeSettings={localThemeSettings}
          onSave={save}
          onPublish={publish}
          hasContent={hasContent}
          hasCategories={hasCategories}
          hasItems={hasItems}
          hasLayout={hasLayout}
          hasTheme={hasTheme}
        />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <MenuProvider>
      <BuilderLayoutContent>{children}</BuilderLayoutContent>
    </MenuProvider>
  );
}
