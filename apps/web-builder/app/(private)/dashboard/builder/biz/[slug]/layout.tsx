'use client';

import { ReactNode } from 'react';
import { BizProvider, useBizBuilder } from './components/biz-provider';
import { FormHeader } from './components/form-header';
import { BackButton } from '@/components/back-button';
import { Spinner } from '@/components/ui/shadcn-io/spinner';

function BuilderLayoutContent({ children }: { children: ReactNode }) {
  const { project, save, publish, isLoading, hasContent, hasLayout, hasTheme } = useBizBuilder();

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
          hasContentWorkExperience={false}
          hasContentEducation={false}
          hasContentProjects={false}
          hasContentSkills={false}
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
    <BizProvider>
      <BuilderLayoutContent>{children}</BuilderLayoutContent>
    </BizProvider>
  );
}
