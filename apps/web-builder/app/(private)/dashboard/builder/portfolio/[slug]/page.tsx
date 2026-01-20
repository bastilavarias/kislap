'use client';

import { usePortfolioBuilder } from './components/portfolio-provider';
import { Dashboard } from './components/dashboard';

export default function PortfolioDashboardPage() {
  const { project } = usePortfolioBuilder();

  return <Dashboard projectID={project?.id} />;
}
