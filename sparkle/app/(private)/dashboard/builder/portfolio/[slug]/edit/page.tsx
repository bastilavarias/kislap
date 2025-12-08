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
      files={builder.files}
      setFiles={builder.setFiles}
      isFileUploadDialogOpen={builder.isFileUploadDialogOpen}
      setIsFileUploadDialogOpen={builder.setIsFileUploadDialogOpen}
      isFileProcessing={builder.isFileProcessing}
      fileProcessingError={builder.fileProcessingError}
      onProcessResumeFile={builder.processResumeFile}
      localThemeSettings={builder.localThemeSettings}
      setLocalThemeSettings={builder.setLocalThemeSettings}
    />
  );
}
