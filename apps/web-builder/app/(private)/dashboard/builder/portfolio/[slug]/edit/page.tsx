'use client';

import { usePortfolioBuilder } from '../components/portfolio-provider';
import { Form } from '../components/form';

export default function PortfolioEditPage() {
  const builder = usePortfolioBuilder();

  return (
    <Form
      formMethods={builder.formMethods}
      layout={builder.layout}
      setLayout={builder.setLayout}
      workFieldArray={builder.workFieldArray}
      educationFieldArray={builder.educationFieldArray}
      showcaseFieldArray={builder.showcaseFieldArray}
      skillFieldArray={builder.skillFieldArray}
      onAddWorkExperience={builder.onAddWorkExperience}
      onAddEducation={builder.onAddEducation}
      onAddShowcase={builder.onAddShowcase}
      onAddTechnologyToShowcase={builder.onAddTechnologyToShowcase}
      onRemoveTechnologyFromShowcase={builder.onRemoveTechnologyFromShowcase}
      isParserOpen={builder.isParserOpen}
      setIsParserOpen={builder.setIsParserOpen}
      applyParsedResume={builder.applyParsedResume}
      fallbackAvatarUrl={builder.fallbackAvatarUrl}
      localThemeSettings={builder.localThemeSettings}
      setLocalThemeSettings={builder.setLocalThemeSettings}
    />
  );
}
