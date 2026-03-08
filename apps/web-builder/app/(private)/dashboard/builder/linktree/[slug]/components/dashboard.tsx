'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Calendar,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Activity,
  CheckCircle2,
} from 'lucide-react';

// --- Types ---
interface ActivityLog {
  id: number;
  type: 'click' | 'view' | 'system';
  message: string;
  created_at: string;
}

// --- Helper Components ---

const RecentActivityFeed = ({
  activities,
  className,
}: {
  activities: ActivityLog[];
  className?: string;
}) => {
  return (
    <Card className={`flex flex-col shadow-sm ${className}`}>
      <CardHeader className="pb-3 border-b bg-muted/20">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Live Linktree Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col min-h-[400px]">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {activities.length > 0 ? (
            <div className="space-y-2">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors flex gap-3 items-start text-sm"
                >
                  <div
                    className={`p-2 rounded-full shrink-0 mt-0.5 
                    ${
                      act.type === 'click'
                        ? 'bg-emerald-100 text-emerald-600'
                        : act.type === 'view'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {act.type === 'click' && <DollarSign className="w-4 h-4" />}
                    {act.type === 'view' && <Calendar className="w-4 h-4" />}
                    {act.type === 'system' && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-foreground leading-none">{act.message}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(act.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-xs">No recent activity.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// --- Main Component ---

export function Dashboard({ projectID }: { projectID?: number }) {
  // State
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // --- API Simulation ---

  const onGetActivities = async () => {
    setActivities([
      {
        id: 1,
        type: 'click',
        message: 'New click on "Twitter"',
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        type: 'view',
        message: 'New view from "192.168.1.1"',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 3,
        type: 'system',
        message: 'Linktree published',
        created_at: new Date(Date.now() - 7200000).toISOString(),
      },
    ]);
  };

  useEffect(() => {
    if (projectID) {
      onGetActivities();
    }
  }, [projectID]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 h-full flex flex-col">
          <RecentActivityFeed activities={activities} className="h-full" />
        </div>
      </div>
    </div>
  );
}
