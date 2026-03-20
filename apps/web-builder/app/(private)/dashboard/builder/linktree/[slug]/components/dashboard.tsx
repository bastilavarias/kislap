'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePageActivity } from '@/hooks/api/use-page-activity';
import {
  APIResponseDashboardStats,
  APIResponsePageActivity,
  APIResponsePageVisit,
  APIResponseTopLink,
} from '@/types/api-response';
import {
  Activity,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  MousePointerClick,
  MousePointerSquareDashed,
  TrendingUp,
  Users,
} from 'lucide-react';

const VISITS_PER_PAGE = 8;
const ACTIVITIES_PER_PAGE = 6;

function formatTargetLabel(target: string) {
  if (!target || target === '/') return 'Homepage';
  if (target.startsWith('mailto:')) return target.replace('mailto:', '');
  if (target.startsWith('tel:')) return target.replace('tel:', '');

  try {
    const parsed = new URL(target);
    return `${parsed.hostname}${parsed.pathname === '/' ? '' : parsed.pathname}`;
  } catch {
    return target;
  }
}

function formatActivityLabel(activity: APIResponsePageActivity) {
  if (activity.type === 'click') {
    return `Clicked ${formatTargetLabel(activity.page_url)}`;
  }
  return 'Viewed linktree page';
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between border-t px-4 py-3">
      <p className="text-xs text-muted-foreground">
        Page {page} of {Math.max(totalPages, 1)}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function Dashboard({ projectID }: { projectID?: number }) {
  const { getOverview, getTopLinks, getVisits, getRecentActivities } = usePageActivity();
  const [stats, setStats] = useState<APIResponseDashboardStats>({
    total_views: 0,
    total_clicks: 0,
    unique_visitors: 0,
  });
  const [visits, setVisits] = useState<APIResponsePageVisit[]>([]);
  const [activities, setActivities] = useState<APIResponsePageActivity[]>([]);
  const [topClickedLinks, setTopClickedLinks] = useState<APIResponseTopLink[]>([]);
  const [visitsPage, setVisitsPage] = useState(1);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [visitsTotalPages, setVisitsTotalPages] = useState(1);
  const [activitiesTotalPages, setActivitiesTotalPages] = useState(1);

  const ctr = useMemo(() => {
    if (!stats.total_views) return 0;
    return Number(((stats.total_clicks / stats.total_views) * 100).toFixed(1));
  }, [stats.total_clicks, stats.total_views]);

  const loadOverview = async () => {
    if (!projectID) return;
    const { success, data } = await getOverview(projectID);
    if (success && data) setStats(data);
  };

  const loadVisits = async (page: number) => {
    if (!projectID) return;
    const { success, data } = await getVisits(page, VISITS_PER_PAGE, projectID);
    if (!success || !data) return;
    setVisits(data.data);
    setVisitsTotalPages(data.meta.last_page || 1);
  };

  const loadRecentActivities = async (page: number) => {
    if (!projectID) return;
    const { success, data } = await getRecentActivities(page, ACTIVITIES_PER_PAGE, projectID);
    if (!success || !data) return;
    setActivities(data.data);
    setActivitiesTotalPages(data.meta.last_page || 1);
  };

  const loadTopClicks = async () => {
    if (!projectID) return;
    const { success, data } = await getTopLinks(projectID, 5);
    if (success && data) setTopClickedLinks(data);
  };

  useEffect(() => {
    if (!projectID) return;
    void Promise.all([loadOverview(), loadVisits(1), loadRecentActivities(1), loadTopClicks()]);
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
          <Card
            key={card.title}
            className={card.highlighted ? 'shadow-sm border-l-4 border-l-primary' : 'shadow-sm'}
          >
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MousePointerSquareDashed className="h-4 w-4" />
              Top Clicked Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topClickedLinks.length > 0 ? (
              topClickedLinks.map((item, index) => (
                <div key={item.page_url} className="flex items-center justify-between rounded-lg border bg-muted/20 px-4 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                        #{index + 1}
                      </Badge>
                      <p className="truncate text-sm font-medium">{formatTargetLabel(item.page_url)}</p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Last clicked {new Date(item.last_clicked_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{item.click_count}</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.total_clicks ? Math.round((item.click_count / stats.total_clicks) * 100) : 0}% of clicks
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                No link click data yet. New clicks from the active Linktree templates will start showing here.
              </div>
            )}
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
                  {visits.length > 0 ? (
                    visits.map((visit, index) => (
                      <tr key={`${visit.ip_address}-${index}`} className="hover:bg-muted/20">
                        <td className="px-4 py-3 font-mono text-xs">{visit.ip_address}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {new Date(visit.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No visitor data yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              page={visitsPage}
              totalPages={visitsTotalPages}
              onChange={(page) => {
                setVisitsPage(page);
                void loadVisits(page);
              }}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/60">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <div key={`${activity.created_at}-${index}`} className="flex items-start justify-between gap-4 px-4 py-4 hover:bg-muted/20">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{formatActivityLabel(activity)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {activity.ip_address} · {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                  {activity.type === 'click' ? (
                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <Eye className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">No activity yet.</div>
            )}
          </div>
          <Pagination
            page={activitiesPage}
            totalPages={activitiesTotalPages}
            onChange={(page) => {
              setActivitiesPage(page);
              void loadRecentActivities(page);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
