'use client';

import { useLinktreeBuilder } from '../components/linktree-provider';
import { Form } from '../components/form';

export default function BizEditPage() {
  const builder = useLinktreeBuilder();

  return (
    <Form
      formMethods={builder.formMethods}
      layout={builder.layout}
      setLayout={builder.setLayout}
      localThemeSettings={builder.localThemeSettings}
      setLocalThemeSettings={builder.setLocalThemeSettings}
      socialLinksFieldArray={builder.socialLinksFieldArray}
      onAddSocialLink={builder.onAddSocialLink}
    />
  );
}
