'use client';

import { Form } from '../components/form';
import { useMenuBuilder } from '../components/menu-provider';

export default function MenuEditPage() {
  const builder = useMenuBuilder();

  return (
    <Form
      formMethods={builder.formMethods}
      categoriesFieldArray={builder.categoriesFieldArray}
      itemsFieldArray={builder.itemsFieldArray}
      layout={builder.layout}
      setLayout={builder.setLayout}
      localThemeSettings={builder.localThemeSettings}
      setLocalThemeSettings={builder.setLocalThemeSettings}
      project={builder.project}
    />
  );
}
