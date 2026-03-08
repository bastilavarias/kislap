'use client';

import { ReactNode } from 'react';
import { LinktreeProvider, useLinktreeBuilder } from './components/linktree-provider';
import { FormHeader } from './components/form-header';
import { BackButton } from '@/components/back-button';
import { Spinner } from '@/components/ui/shadcn-io/spinner';

function BuilderLayoutContent({ children }: { children: ReactNode }) {
  const {
    project,
    save,
    publish,
    isLoading,
    hasContent,
    hasContentSocialLinks,
    hasLayout,
    hasTheme,
  } = useLinktreeBuilder();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
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
          onSave={save}
          onPublish={publish}
          hasContent={hasContent}
          hasContentSocialLinks={hasContentSocialLinks}
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
    <LinktreeProvider>
      <BuilderLayoutContent>{children}</BuilderLayoutContent>
    </LinktreeProvider>
  );
}
