'use client';

import { useLinktreeBuilder } from './components/linktree-provider';
import { Dashboard } from './components/dashboard';

export default function LinktreeDashboardPage() {
  const { project } = useLinktreeBuilder();

  return <Dashboard projectID={project?.id} />;
}
