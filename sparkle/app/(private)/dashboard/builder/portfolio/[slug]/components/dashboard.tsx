'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Calendar,
  Search,
  Eye,
  MapPin,
  Clock,
  MoreHorizontal,
  Sparkles,
  Globe,
  Activity,
  ChevronLeft,
  ChevronRight,
  Lock,
  Mail,
  Phone,
  MousePointerClick,
  Server,
} from 'lucide-react';
import { useAppointment } from '@/hooks/api/use-appointment';
import { usePageActivity } from '@/hooks/api/use-page-activity';
import { APIResponseAppoinment } from '@/types/api-response';

interface PageVisit {
  ip_address: string;
  location: string;
  created_at: string;
}

interface PageActivity {
  type: string;
  page_url: string;
  ip_address: string;
  model: Record<string, any> | null;
  model_name?: string;
  created_at: string;
}

interface PageStats {
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
}

const APPOINTMENTS_PER_PAGE = 10;
const VISITS_PER_PAGE = 10;
const RECENT_ACTS_PER_PAGE = 5;

const PaginationControls = ({
  page,
  total,
  onPageChange,
}: {
  page: number;
  total: number;
  onPageChange: (p: number) => void;
}) => (
  <div className="flex items-center justify-end space-x-2 py-4">
    <div className="flex-1 text-xs text-muted-foreground">
      Page {page} of {total}
    </div>
    <div className="space-x-2 flex items-center">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="h-8 px-2"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= total}
        onClick={() => onPageChange(page + 1)}
        className="h-8 px-2"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

const getActivityConfig = (type: string) => {
  switch (type.toLowerCase()) {
    case 'click':
      return {
        icon: MousePointerClick,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        label: 'Interaction',
      };
    case 'view':
      return {
        icon: Eye,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        label: 'Page View',
      };
    default:
      return {
        icon: Activity,
        color: 'text-gray-500',
        bg: 'bg-gray-500/10',
        label: 'System Event',
      };
  }
};

const RecentActivityFeed = ({
  activities,
  page,
  totalPages,
  onPageChange,
}: {
  activities: PageActivity[];
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Audit Log
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex flex-col min-h-[400px]">
        <div className="flex-1 overflow-y-auto">
          {activities.length > 0 ? (
            <div className="divide-y divide-border/50">
              {activities.map((activity, index) => {
                const config = getActivityConfig(activity.type);
                const Icon = config.icon;

                return (
                  <div
                    key={index}
                    className="p-4 hover:bg-muted/30 transition-colors group flex gap-3 items-start"
                  >
                    <div className={`p-2 rounded-md shrink-0 mt-0.5 ${config.bg}`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{config.label}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(activity.created_at).toLocaleTimeString([], { hour12: true })}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        User detected on{' '}
                        <span className="font-medium text-foreground">
                          {activity.model?.name || 'Unknown Entity'}
                        </span>{' '}
                        via{' '}
                        <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded text-violet-600/80">
                          {activity.page_url}
                        </span>
                      </p>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-sm bg-muted/50 border border-border/50">
                          <Server className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {activity.ip_address}
                          </span>
                        </div>

                        {activity.model_name && (
                          <Badge variant="secondary" className="text-[10px] h-5 font-normal px-1.5">
                            {activity.model_name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 p-8">
              <div className="p-3 bg-muted rounded-full">
                <Activity className="w-6 h-6 opacity-20" />
              </div>
              <p className="text-xs">No activity logs recorded yet.</p>
            </div>
          )}
        </div>

        {/* Footer Pagination */}
        <div className="px-4 py-3 border-t bg-muted/20 mt-auto">
          <PaginationControls page={page} total={totalPages} onPageChange={onPageChange} />
        </div>
      </CardContent>
    </Card>
  );
};

export function Dashboard({ projectID }: { projectID?: number }) {
  const [appointments, setAppointments] = useState<APIResponseAppoinment[]>([]);
  const [pageVisits, setPageVisits] = useState<PageVisit[]>([]);
  const [activities, setActivities] = useState<PageActivity[]>([]);

  const [pageStats, setPageStats] = useState<PageStats>({
    totalViews: 0,
    totalClicks: 0,
    uniqueVisitors: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<APIResponseAppoinment | null>(
    null
  );

  const [appPage, setAppPage] = useState(1);
  const [viewsPage, setViewsPage] = useState(1);
  const [actPage, setActPage] = useState(1);

  const [appointmentTotals, setAppointmentTotals] = useState(0);
  const [totalPageVisits, setTotalPageVisits] = useState(0);
  const [totalRecentActivities, setTotalRecentActivities] = useState(0);

  const [isVisitsTableBusy, setVisitsTableBusy] = useState(false);

  const { list: getAppointmentList } = useAppointment();
  const { getOverview, getVisits, getRecentActivities } = usePageActivity();

  const onGetAppointments = async (page: number, search: string = '') => {
    if (!projectID) return;

    const { success, data, message } = await getAppointmentList(
      page,
      APPOINTMENTS_PER_PAGE,
      projectID
    );

    if (success && data) {
      setAppointments(data.data);
      setAppointmentTotals(data.meta?.total || 0);
    } else {
      toast.error(message || 'Failed to load appointments');
    }
  };

  const onGetPageStats = async () => {
    if (!projectID) return;
    const { success, data, message } = await getOverview(projectID);

    if (success && data) {
      setPageStats({
        totalViews: data.total_views || 0,
        totalClicks: data.total_clicks || 0,
        uniqueVisitors: data.unique_visitors || 0,
      });
    }
  };

  const onGetPageVisits = async (page: number) => {
    if (!projectID) return;

    const { success, data } = await getVisits(page, VISITS_PER_PAGE, projectID);

    if (!success || !data) return;

    setVisitsTableBusy(true);
    const lookups = await Promise.all(
      data.data.map(async (visit) => {
        try {
          const res = await fetch(`https://ipwho.is/${visit.ip_address}`);
          const geo = await res.json();

          return {
            ip_address: visit.ip_address,
            location: geo.success ? geo.country : 'Unknown',
            created_at: visit.created_at,
          };
        } catch (err) {
          return {
            ip_address: visit.ip_address,
            location: 'Unknown',
            created_at: visit.created_at,
          };
        }
      })
    );

    setVisitsTableBusy(false);
    setPageVisits(lookups);
    setTotalPageVisits(data.meta.last_page || 0);
  };

  const onGetPageActivities = async (page: number) => {
    if (!projectID) return;
    const { success, data } = await getRecentActivities(page, RECENT_ACTS_PER_PAGE, projectID);

    if (success && data) {
      setActivities(data.data);
      setTotalRecentActivities(data.meta.last_page || 0);
    }
  };

  useEffect(() => {
    if (projectID) {
      const init = async () => {
        await Promise.all([
          onGetPageStats(),
          onGetAppointments(1, searchTerm),
          onGetPageActivities(1),
        ]);
        onGetPageVisits(1);
      };

      init();
    }
  }, [projectID]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppPage(1);
      onGetAppointments(1, searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleAppPageChange = (newPage: number) => {
    setAppPage(newPage);
    onGetAppointments(newPage, searchTerm);
  };

  const handleViewPageChange = (newPage: number) => {
    setViewsPage(newPage);
    onGetPageVisits(newPage);
  };

  const handleActPageChange = (newPage: number) => {
    setActPage(newPage);
    onGetPageActivities(newPage);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* 1. Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointmentTotals}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pageStats.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pageStats.uniqueVisitors.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* 2. AI Teaser */}
      <Card className="pb-2 relative overflow-hidden border-dashed border-2 border-violet-200 dark:border-violet-900 bg-violet-50/50 dark:bg-violet-950/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-violet-100 dark:bg-violet-900/40 rounded-lg">
              <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <CardTitle className="text-lg text-violet-900 dark:text-violet-100">
              AI Analyst Insights
            </CardTitle>
            <Badge
              variant="secondary"
              className="ml-auto bg-violet-100 text-violet-700 hover:bg-violet-200 border-violet-200"
            >
              Coming Soon
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="filter blur-sm select-none opacity-50 space-y-4 pointer-events-none">
              <div className="bg-white/60 dark:bg-black/20 p-4 rounded-xl border border-violet-100 dark:border-violet-900/50">
                <p className="text-sm font-medium text-violet-800 dark:text-violet-200 leading-relaxed">
                  Based on recent activity...
                </p>
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="bg-background/80 backdrop-blur-md p-4 rounded-full shadow-sm mb-3 ring-1 ring-border">
                <Lock className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <p className="text-sm font-medium text-muted-foreground text-center max-w-md bg-background/60 backdrop-blur-sm px-4 py-1 rounded-full">
                We are fine-tuning our AI models.
                <br />
                <span className="font-bold text-foreground">Stay tuned!</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Appointments Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Appointments</CardTitle>
              <CardDescription>Recent booking requests and messages.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3 hidden md:table-cell">Contact</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {appointments.length > 0 ? (
                  appointments.map((app) => (
                    <tr
                      key={app.id}
                      className="bg-card hover:bg-muted/50 transition-colors cursor-pointer group"
                      onClick={() => setSelectedAppointment(app)}
                    >
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {app.name.charAt(0)}
                          </div>
                          <div className="group-hover:text-primary transition-colors">
                            {app.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex flex-col text-xs">
                          <span>{app.email}</span>
                          <span className="text-muted-foreground">{app.contact_number}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-[200px]">
                        <p
                          className="truncate text-muted-foreground text-xs"
                          title={app.message || ''}
                        >
                          {app.message || '-'}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="h-24 text-center text-muted-foreground">
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <PaginationControls
            page={appPage}
            total={appointmentTotals}
            onPageChange={handleAppPageChange}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" /> Visitor Log
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="flex-1">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/30 text-muted-foreground text-xs sticky top-0 backdrop-blur-sm">
                  <tr>
                    <th className="px-4 py-2 font-medium">Location</th>
                    <th className="px-4 py-2 font-medium">IP Address</th>
                    <th className="px-4 py-2 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {isVisitsTableBusy ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 py-3">
                          <div className="h-3 w-24 bg-muted rounded" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-3 w-32 bg-muted rounded" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-3 w-20 bg-muted rounded" />
                        </td>
                      </tr>
                    ))
                  ) : pageVisits.length > 0 ? (
                    pageVisits.map((view, index) => (
                      <tr
                        key={index}
                        className="hover:bg-muted/20 border-t border-dashed border-border/50"
                      >
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs font-medium">
                              {view.location || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground font-mono">
                          <div className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-sm bg-muted/50 border border-border/50">
                            <Server className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {view.ip_address}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(view.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="h-24 text-center text-xs text-muted-foreground">
                        No recent visits.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 border-t">
              <PaginationControls
                page={viewsPage}
                total={totalPageVisits}
                onPageChange={handleViewPageChange}
              />
            </div>
          </CardContent>
        </Card>

        <RecentActivityFeed
          activities={activities}
          page={actPage}
          totalPages={totalRecentActivities}
          onPageChange={handleActPageChange}
        />
      </div>

      <Dialog
        open={!!selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
      >
        {selectedAppointment && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>
                Received on{' '}
                {selectedAppointment && new Date(selectedAppointment.created_at).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Client Name
                  </span>
                  <p className="text-sm font-medium">{selectedAppointment.name}</p>
                </div>
              </div>

              <div className="space-y-3 p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedAppointment.email}</span>
                </div>
                {selectedAppointment.contact_number && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedAppointment.contact_number}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground uppercase">
                  Message Content
                </span>
                <div className="p-4 bg-muted/20 rounded-lg text-sm leading-relaxed border-l-2 border-primary">
                  {selectedAppointment.message || (
                    <span className="text-muted-foreground italic">No message content.</span>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                Close
              </Button>
              <Button>Reply via Email</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
