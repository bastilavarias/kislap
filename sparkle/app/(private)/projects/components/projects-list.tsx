'use client';

import { useState, useEffect } from 'react';
import { useProject } from '@/hooks/api/use-project';
import type { APIResponseProject } from '@/types/api-response';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Eye,
  MoreVertical,
  Calendar,
  Globe,
  BarChart3,
  MessageSquare,
  Zap,
  Layout,
  Pencil,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// --- Types ---
export interface APIResponsePortfolio {
  id: number;
  name: string;
  [key: string]: any;
}

const typeConfig: Record<string, { label: string; color: string; icon: any }> = {
  portfolio: {
    label: 'Portfolio',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    icon: Layout,
  },
  biz: {
    label: 'Business',
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    icon: BarChart3,
  },
  links: {
    label: 'Link-in-Bio',
    color: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    icon: ExternalLink,
  },
  waitlist: {
    label: 'Waitlist',
    color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    icon: Zap,
  },
};

interface ProjectCardProps {
  project: APIResponseProject;
}

function ProjectCard({ project }: ProjectCardProps) {
  const typeInfo = typeConfig[project.type] || typeConfig.portfolio;
  const createdDate = new Date(project.created_at);
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Generate a deterministic gradient based on ID for visual variety
  const gradients = [
    'from-blue-500/20 via-indigo-500/20 to-violet-500/20',
    'from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
    'from-orange-500/20 via-amber-500/20 to-yellow-500/20',
    'from-pink-500/20 via-rose-500/20 to-red-500/20',
  ];
  const bgGradient = gradients[project.id % gradients.length];

  return (
    <Card className="group relative flex flex-col h-full overflow-hidden border-border/60 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 bg-card">
      {/* 1. VISUAL HEADER (Thumbnail Placeholder) */}
      <div className={cn('h-32 w-full relative bg-gradient-to-br', bgGradient)}>
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

        {/* Floating Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge
            variant={project.published ? 'default' : 'secondary'}
            className={cn(
              'font-semibold shadow-sm backdrop-blur-md',
              project.published
                ? 'bg-green-500/90 hover:bg-green-500'
                : 'bg-black/50 hover:bg-black/60 text-white'
            )}
          >
            {project.published ? 'Published' : 'Draft'}
          </Badge>
        </div>

        {/* Project Icon/Type */}
        <div className="absolute -bottom-6 left-5">
          <div className="h-12 w-12 rounded-xl bg-background border shadow-sm flex items-center justify-center">
            <typeInfo.icon className="w-6 h-6 text-foreground/80" />
          </div>
        </div>
      </div>

      <CardHeader className="pt-8 pb-2 px-5">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <h3 className="font-bold text-xl leading-none tracking-tight group-hover:text-primary transition-colors">
              <Link
                href={`/projects/builder/portfolio/${project.slug}`}
                className="focus:outline-none"
              >
                <span className="absolute inset-0" aria-hidden="true" />
                {project.name}
              </Link>
            </h3>
            {project.sub_domain && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground z-10 relative">
                <Globe className="w-3 h-3" />
                <a
                  href={`https://${project.sub_domain}.kislap.app`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary hover:underline transition-colors"
                >
                  {project.sub_domain}.kislap.app
                </a>
              </div>
            )}
          </div>

          {/* Context Menu (z-20 to sit above the card link) */}
          <div className="relative z-20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" /> View Site
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {project.description || 'No description provided for this project.'}
        </p>
      </CardContent>

      <CardFooter className="px-5 py-4 bg-muted/30 border-t mt-auto">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground font-medium">
          {/* Quick Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5" title="Total Views">
              <Eye className="w-3.5 h-3.5" />
              <span>{(0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Engagement">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>0%</span>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5 opacity-80">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </CardFooter>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[280px] bg-muted/40 rounded-xl border border-border/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (booted && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-muted/10">
        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
          <Layout className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">No projects yet</h3>
        <p className="text-muted-foreground max-w-sm mx-auto mb-6">
          You haven't created any portfolios yet. Start building your first project to share your
          work with the world.
        </p>
        <Button size="lg">Create Project</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
