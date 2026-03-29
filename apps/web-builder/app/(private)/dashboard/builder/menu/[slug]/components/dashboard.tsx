'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, ChevronLeft, ChevronRight, Eye, MousePointerClick, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePageActivity } from '@/hooks/api/use-page-activity';
import { APIResponseDashboardStats, APIResponsePageActivity, APIResponsePageVisit } from '@/types/api-response';

const VISITS_PER_PAGE = 8;
const ACTIVITIES_PER_PAGE = 6;

function formatTrackedLabel(target: string) {
  if (target.startsWith('menu-item:')) return target.replace('menu-item:', '');
  if (target.startsWith('menu-category:')) return target.replace('menu-category:', '');
  return target || 'Homepage';
}

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  return (
    <div className="flex items-center justify-between border-t px-4 py-3">
      <p className="text-xs text-muted-foreground">
        Page {page} of {Math.max(totalPages, 1)}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function Dashboard({ projectID }: { projectID?: number }) {
  const { getOverview, getVisits, getRecentActivities } = usePageActivity();
  const [stats, setStats] = useState<APIResponseDashboardStats>({ total_views: 0, total_clicks: 0, unique_visitors: 0 });
  const [visits, setVisits] = useState<APIResponsePageVisit[]>([]);
  const [activities, setActivities] = useState<APIResponsePageActivity[]>([]);
  const [visitsPage, setVisitsPage] = useState(1);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [visitsTotalPages, setVisitsTotalPages] = useState(1);
  const [activitiesTotalPages, setActivitiesTotalPages] = useState(1);

  const normalizeList = <T,>(value: T[] | null | undefined) => (Array.isArray(value) ? value : []);

  const loadOverview = async () => {
    if (!projectID) return;
    const { success, data } = await getOverview(projectID);
    if (success && data) setStats(data);
  };

  const loadVisits = async (page: number) => {
    if (!projectID) return;
    const { success, data } = await getVisits(page, VISITS_PER_PAGE, projectID);
    if (success && data) {
      setVisits(normalizeList(data.data));
      setVisitsTotalPages(data.meta.last_page || 1);
    }
  };

  const loadRecentActivities = async (page: number) => {
    if (!projectID) return;
    const { success, data } = await getRecentActivities(page, ACTIVITIES_PER_PAGE, projectID);
    if (success && data) {
      setActivities(normalizeList(data.data));
      setActivitiesTotalPages(data.meta.last_page || 1);
    }
  };

  const ctr = useMemo(() => (stats.total_views ? Number(((stats.total_clicks / stats.total_views) * 100).toFixed(1)) : 0), [stats.total_clicks, stats.total_views]);

  useEffect(() => {
    if (!projectID) return;
    void Promise.all([
      loadOverview(),
      loadVisits(1),
      loadRecentActivities(1),
    ]);
  }, [projectID]);

  const statCards = [
    { title: 'Views', value: stats.total_views.toLocaleString(), icon: Eye, highlighted: true },
    { title: 'Clicks', value: stats.total_clicks.toLocaleString(), icon: MousePointerClick },
    { title: 'Visitors', value: stats.unique_visitors.toLocaleString(), icon: Users },
    { title: 'CTR', value: `${ctr}%`, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title} className={card.highlighted ? 'border-l-4 border-l-primary shadow-sm' : 'shadow-sm'}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {activities.length ? activities.map((activity, index) => (
                <div key={`${activity.created_at}-${index}`} className="px-4 py-4">
                  <p className="text-sm font-medium">
                    {activity.type === 'click'
                      ? `Clicked ${formatTrackedLabel(activity.page_url)}`
                      : 'Viewed menu page'}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {activity.ip_address} · {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              )) : <div className="px-4 py-8 text-center text-sm text-muted-foreground">No activity yet.</div>}
            </div>
            <Pagination page={activitiesPage} totalPages={activitiesTotalPages} onChange={(page) => {
              setActivitiesPage(page);
              void loadRecentActivities(page);
            }} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="h-4 w-4" />
              Recent Visitors
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead className="bg-muted/30 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">IP Address</th>
                    <th className="px-4 py-3 font-medium">Last Seen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {visits.length ? visits.map((visit, index) => (
                    <tr key={`${visit.ip_address}-${index}`} className="hover:bg-muted/20">
                      <td className="px-4 py-3 font-mono text-xs">{visit.ip_address}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(visit.created_at).toLocaleString()}</td>
                    </tr>
                  )) : <tr><td colSpan={2} className="px-4 py-8 text-center text-sm text-muted-foreground">No visitor data yet.</td></tr>}
                </tbody>
              </table>
            </div>
            <Pagination page={visitsPage} totalPages={visitsTotalPages} onChange={(page) => {
              setVisitsPage(page);
              void loadVisits(page);
            }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

