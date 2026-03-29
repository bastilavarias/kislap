'use client';

import { Dashboard } from './components/dashboard';
import { useMenuBuilder } from './components/menu-provider';

export default function MenuDashboardPage() {
  const { project } = useMenuBuilder();

  return <Dashboard projectID={project?.id} />;
}
