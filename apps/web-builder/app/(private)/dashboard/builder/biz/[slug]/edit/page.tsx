'use client';

import { useBizBuilder } from '../components/biz-provider';
import { Form } from '../components/form';

export default function BizEditPage() {
  const builder = useBizBuilder();

  return (
    <Form
      formMethods={builder.formMethods}
      layout={builder.layout}
      setLayout={builder.setLayout}
      localThemeSettings={builder.localThemeSettings}
      setLocalThemeSettings={builder.setLocalThemeSettings}
      socialLinksFieldArray={builder.socialLinksFieldArray}
      servicesFieldArray={builder.servicesFieldArray}
      productsFieldArray={builder.productsFieldArray}
      testimonialsFieldArray={builder.testimonialsFieldArray}
      onAddSocialLink={builder.onAddSocialLink}
      onAddService={builder.onAddService}
      onAddProduct={builder.onAddProduct}
      onAddTestimonial={builder.onAddTestimonial}
      files={builder.files}
      setFiles={builder.setFiles}
    />
  );
}
