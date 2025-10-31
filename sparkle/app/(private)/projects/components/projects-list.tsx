'use client';

import { useState, useEffect } from 'react';
import { useProject } from '@/hooks/api/use-project';
import type { APIResponseProject } from '@/types/api-response';
import { toast } from 'sonner';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '@/components/ui/button-group';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export interface APIResponsePortfolio {
  id: number;
  name: string;
  [key: string]: any;
}

const typeConfig = {
  portfolio: {
    label: 'Portfolio',
    emoji: '🎨',
  },
  biz: {
    label: 'Business',
    emoji: '💼',
  },
  links: {
    label: 'Links',
    emoji: '🔗',
  },
  waitlist: {
    label: 'Waitlist',
    emoji: '⏳',
  },
};

interface ProjectCardProps {
  project: APIResponseProject;
}

function ProjectCard({ project }: ProjectCardProps) {
  const typeInfo = typeConfig[project.type];
  const createdDate = new Date(project.created_at);
  const isRecent = new Date().getTime() - createdDate.getTime() < 7 * 24 * 60 * 60 * 1000;

  const formattedDate = createdDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="group relative h-full cursor-pointer overflow-hidden border-2 border-border/50 hover:border-primary/50 dark:hover:border-primary/30">
      <div className="absolute inset-0 pointer-events-none" />
      <CardHeader className="relative pb-3">
        <CardTitle className="text-3xl font-bold line-clamp-1 flex items-center justify-between">
          <Link href={`/projects/builder/portfolio/${project.slug}`}>{project.name}</Link>
          <Badge
            variant="outline"
            className="whitespace-nowrap flex-shrink-0 font-semibold text-xs"
          >
            {typeInfo.label}
          </Badge>
        </CardTitle>
        {project.sub_domain && (
          <CardDescription>
            <Link href="/p/resume" className="text-muted-foreground truncate hover:underline">
              <span className="text-sm">🌐</span>
              {project.sub_domain}.kislap.app
            </Link>
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="relative space-y-3">
        {project.description && (
          <p className="text-muted-foreground line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}

        <div className="space-y-2 pt-3 border-t border-border/50">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/40 rounded-lg p-2.5 hover:bg-muted/60 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Views
                </span>
                <span className="text-sm">👁️</span>
              </div>
              <p className="text-base font-bold text-foreground">{(0 / 1000).toFixed(1)}k</p>
            </div>

            {/* Engagement Stat */}
            <div className="bg-muted/40 rounded-lg p-2.5 hover:bg-muted/60 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Engage
                </span>
                <span className="text-sm">💬</span>
              </div>
              <p className="text-base font-bold text-foreground">1%</p>
            </div>

            <div className="bg-muted/40 rounded-lg p-2.5 hover:bg-muted/60 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Perf
                </span>
                <span className="text-sm">⚡</span>
              </div>
              <p className="text-base font-bold text-foreground">1%</p>
            </div>

            {/* Status Stat */}
            <div className="bg-muted/40 rounded-lg p-2.5 hover:bg-muted/60 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Status
                </span>
                <span className="text-sm">{project.published ? '🟢' : '🔴'}</span>
              </div>
              <p className="text-base font-bold text-foreground">
                {project.published ? 'Published' : 'Unpublished'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-3 border-t border-border/50">
          {project.portfolio && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                📚 Portfolio
              </span>
              <span className="text-xs font-semibold text-foreground bg-muted/50 px-2 py-1 rounded-md truncate">
                {project.portfolio.name}
              </span>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                📅 Created
              </span>
              <span className="text-xs font-semibold text-foreground">{formattedDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                📅 Updated
              </span>
              <span className="text-xs font-semibold text-foreground">{formattedDate}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardAction className="flex justify-between items-center px-6 w-full">
        <ButtonGroup>
          <Button variant="ghost" asChild>
            <Link href={`/projects/builder/portfolio/${project.slug}`}>
              <Eye /> View
            </Link>
          </Button>
          <Button variant="ghost">
            <Pencil /> Edit
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button variant="ghost">
            <Trash2 /> Remove
          </Button>
        </ButtonGroup>
      </CardAction>
    </Card>
  );
}

export function ProjectList() {
  const [projects, setProjects] = useState<APIResponseProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booted, setBooted] = useState(false);

  const { getList } = useProject();

  const onGetProjects = async () => {
    setError('');
    setLoading(true);
    const { success, data, message } = await getList();

    if (success && data) {
      setProjects(data);
      setLoading(false);
      setBooted(true);
      return;
    }

    toast(message);
    setLoading(false);
    setBooted(true);
  };

  useEffect(() => {
    onGetProjects();
  }, []);

  if (!booted || loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-80 bg-gradient-to-br from-muted to-muted/50 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (booted && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <span className="text-3xl">📁</span>
        </div>
        <p className="text-lg font-semibold text-foreground mb-2">No projects yet</p>
        <p className="text-sm text-muted-foreground">Create your first project to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
