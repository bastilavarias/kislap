import { createFileRoute } from '@tanstack/react-router'
import NewProject from '@/features/apps/new'

export const Route = createFileRoute('/_authenticated/projects/new')({
  component: NewProject,
})
