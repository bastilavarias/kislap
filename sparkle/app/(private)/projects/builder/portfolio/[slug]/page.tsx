'use client';

import { usePortfolioBuilder } from './components/portfolio-provider';
import { Dashboard } from './components/dashboard'; // Move your dashboard code to a separate file

export default function PortfolioDashboardPage() {
  const { project } = usePortfolioBuilder();
  return <Dashboard projectId={project?.id} />;
}
