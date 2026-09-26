'use client';

import { useLinktreeBuilder } from '../components/linktree-provider';
import { Form } from '../components/form';

export default function BizEditPage() {
  const builder = useLinktreeBuilder();

  return (
    <Form
      formMethods={builder.formMethods}
      localThemeSettings={builder.localThemeSettings}
      setLocalThemeSettings={builder.setLocalThemeSettings}
      sectionsFieldArray={builder.sectionsFieldArray}
      onAddSection={builder.onAddSection}
    />
  );
}
