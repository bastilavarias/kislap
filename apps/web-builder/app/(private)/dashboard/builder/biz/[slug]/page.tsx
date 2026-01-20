'use client';

import { useBizBuilder } from './components/biz-provider';
import { Dashboard } from './components/dashboard';

export default function BizDashboardPage() {
  const { project } = useBizBuilder();

  return <Dashboard projectID={project?.id} />;
}
