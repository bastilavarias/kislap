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
import { Spinner } from '@/components/ui/shadcn-io/spinner';

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
} from 'lucide-react';

interface Appointment {
  id: number;
  user_id: number;
  project_id: number;
  name: string;
  email: string;
  contact_number?: string;
  message?: string;
  created_at: string;
  updated_at: string;
}

interface PageView {
  id: number;
  ip_address: string;
  location: string;
  device: string;
  viewed_at: string;
}

interface PageActivity {
  id: number;
  action: string;
  target_details: string;
  ip_address: string;
  occurred_at: string;
}

interface DashboardStats {
  totalAppointments: number;
  totalPageViews: number;
  uniqueVisitors: number;
}

export function Dashboard({ projectId }: { projectId?: number }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [activities, setActivities] = useState<PageActivity[]>([]);

  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    totalPageViews: 0,
    uniqueVisitors: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const [appPage, setAppPage] = useState(1);
  const [viewsPage, setViewsPage] = useState(1);
  const [actPage, setActPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const fetchDashboardData = async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockAppointments: Appointment[] = Array.from({ length: 18 }).map((_, i) => ({
        id: i + 1,
        user_id: 100 + i,
        project_id: projectId,
        name: [
          'Alice Johnson',
          'Bob Smith',
          'Charlie Davis',
          'Diana Prince',
          'Evan Wright',
          'Fiona Gallagher',
          'George Martin',
          'Hannah Lee',
        ][i % 8],
        email: `user${i}@example.com`,
        contact_number: i % 3 === 0 ? `+1 555 010${i}` : undefined,
        message:
          i % 4 === 0
            ? 'Hi, I saw your portfolio and loved the design! Are you available for freelance?'
            : 'Just checking in on the project status.',
        created_at: new Date(Date.now() - i * 86400000).toISOString(),
        updated_at: new Date().toISOString(),
      }));

      const mockPageViews: PageView[] = Array.from({ length: 25 }).map((_, i) => ({
        id: i + 1,
        ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        location: [
          'New York, US',
          'London, UK',
          'Tokyo, JP',
          'Berlin, DE',
          'Sydney, AU',
          'Toronto, CA',
        ][i % 6],
        device: ['Desktop (Chrome)', 'Mobile (Safari)', 'Desktop (Firefox)', 'Tablet (iPad)'][
          i % 4
        ],
        viewed_at: new Date(Date.now() - i * 1800000).toISOString(),
      }));

      const mockActivities: PageActivity[] = Array.from({ length: 20 }).map((_, i) => ({
        id: i + 1,
        action: [
          'Downloaded Resume',
          'Clicked Project',
          'Viewed Experience',
          'Copied Email',
          'Scroll Depth 100%',
        ][i % 5],
        target_details: [
          'resume.pdf',
          'E-Commerce App',
          'Senior Dev @ TechCorp',
          'Clipboard',
          'Home Page',
        ][i % 5],
        ip_address: `192.168.1.${10 + i}`,
        occurred_at: new Date(Date.now() - i * 900000).toISOString(),
      }));

      setAppointments(mockAppointments);
      setPageViews(mockPageViews);
      setActivities(mockActivities);
      setStats({
        totalAppointments: 18,
        totalPageViews: 1245,
        uniqueVisitors: 843,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [projectId]);

  // Filter Logic
  const filteredAppointments = appointments.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const paginate = <T,>(data: T[], page: number) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  };

  const totalAppPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);
  const totalViewPages = Math.ceil(pageViews.length / ITEMS_PER_PAGE);
  const totalActPages = Math.ceil(activities.length / ITEMS_PER_PAGE);

  const paginatedAppointments = paginate(filteredAppointments, appPage);
  const paginatedViews = paginate(pageViews, viewsPage);
  const paginatedActivities = paginate(activities, actPage);

  // Reusable Pagination Controls
  const PaginationControls = ({
    page,
    total,
    setPage,
  }: {
    page: number;
    total: number;
    setPage: (p: number) => void;
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
          onClick={() => setPage(page - 1)}
          className="h-8 px-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page === total || total === 0}
          onClick={() => setPage(page + 1)}
          className="h-8 px-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">Pending inquiries</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">New audience reach</p>
          </CardContent>
        </Card>
      </div>

      {/* 2. AI "Coming Soon" Teaser */}
      <Card className="relative overflow-hidden border-dashed border-2 border-violet-200 dark:border-violet-900 bg-violet-50/50 dark:bg-violet-950/20">
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
            {/* Blurred Content to Tease */}
            <div className="filter blur-sm select-none opacity-50 space-y-4 pointer-events-none">
              <div className="bg-white/60 dark:bg-black/20 p-4 rounded-xl border border-violet-100 dark:border-violet-900/50">
                <p className="text-sm font-medium text-violet-800 dark:text-violet-200 leading-relaxed">
                  Based on recent activity, your portfolio is trending in the US region. Users who
                  view your 'Senior Developer' experience are 40% more likely to download your
                  resume.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 ml-1">
                  Suggestions
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    Consider moving your contact form higher to improve conversion.
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    Add more details to your 'E-Commerce' project to reduce bounce rate.
                  </li>
                </ul>
              </div>
            </div>

            {/* Overlay Lock */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="bg-background/80 backdrop-blur-md p-4 rounded-full shadow-sm mb-3 ring-1 ring-border">
                <Lock className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <p className="text-sm font-medium text-muted-foreground text-center max-w-md bg-background/60 backdrop-blur-sm px-4 py-1 rounded-full">
                We are fine-tuning our AI models to give you actionable insights.
                <br />
                <span className="font-bold text-foreground">Stay tuned for updates!</span>
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
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Filter client..."
                  className="w-[200px] pl-8 h-9"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setAppPage(1); // Reset to page 1 on search
                  }}
                />
              </div>
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
                {paginatedAppointments.length > 0 ? (
                  paginatedAppointments.map((app) => (
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
          <PaginationControls page={appPage} total={totalAppPages} setPage={setAppPage} />
        </CardContent>
      </Card>

      {/* 4. Page Views & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Table */}
        <Card className="shadow-sm flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" /> Visitor Log
              </CardTitle>
              <Badge variant="outline">Real-time</Badge>
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
                  {paginatedViews.map((view) => (
                    <tr key={view.id} className="hover:bg-muted/20">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs font-medium">{view.location}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground font-mono">
                        {view.ip_address}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(view.viewed_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 border-t">
              <PaginationControls page={viewsPage} total={totalViewPages} setPage={setViewsPage} />
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="shadow-sm flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" /> User Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="flex-1 px-4 py-2">
              <div className="space-y-4">
                {paginatedActivities.map((act) => (
                  <div
                    key={act.id}
                    className="relative pl-4 border-l border-border pb-4 last:pb-0 last:border-0"
                  >
                    <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-primary" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">{act.action}</span>
                      <span className="text-xs text-muted-foreground">
                        Target: <span className="text-foreground">{act.target_details}</span>
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="text-[10px] h-4 px-1 rounded-sm font-mono text-muted-foreground"
                        >
                          {act.ip_address}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(act.occurred_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-4 border-t mt-auto">
              <PaginationControls page={actPage} total={totalActPages} setPage={setActPage} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Details Dialog */}
      <Dialog
        open={!!selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              Received on{' '}
              {selectedAppointment && new Date(selectedAppointment.created_at).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Client Name
                  </span>
                  <p className="text-sm font-medium">{selectedAppointment.name}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Project ID
                  </span>
                  <p className="text-sm font-mono">{selectedAppointment.project_id}</p>
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
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
              Close
            </Button>
            <Button>Reply via Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
