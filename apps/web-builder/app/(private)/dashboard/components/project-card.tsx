'use client';

import Link from 'next/link';
import type { APIResponseProject } from '@/types/api-response';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  MoreHorizontal,
  Layout,
  BarChart3,
  ExternalLink,
  Zap,
  Globe,
  CalendarDays,
  Pencil,
  Trash2,
  ArrowUpRight,
  UtensilsCrossed,
} from 'lucide-react';

const typeConfig: Record<string, { label: string; color: string; icon: any; projectName: string }> =
  {
    portfolio: {
      label: 'Portfolio',
      color: 'bg-blue-500 text-white border-black',
      icon: Layout,
      projectName: 'portfolio',
    },
    biz: {
      label: 'Business',
      color: 'bg-primary text-white border-black',
      icon: BarChart3,
      projectName: 'biz',
    },
    linktree: {
      label: 'Link-in-Bio',
      color: 'bg-fuchsia-500 text-white border-black',
      icon: ExternalLink,
      projectName: 'linktree',
    },
    menu: {
      label: 'Menu',
      color: 'bg-secondary text-black border-black',
      icon: UtensilsCrossed,
      projectName: 'menu',
    },
    waitlist: {
      label: 'Waitlist',
      color: 'bg-orange-400 text-black border-black',
      icon: Zap,
      projectName: 'waitlist',
    },
  };

interface ProjectCardProps {
  project: APIResponseProject;
  onEdit: (project: APIResponseProject) => void;
  onDelete: (id: number) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const urlPrefix = process.env.NEXT_PUBLIC_URL_PREFIX || 'http://';
  const rootDomain = process.env.NEXT_PUBLIC_SHINE_SUFFIX_URL || 'kislap.test';
  const liveUrl = project?.sub_domain ? `${urlPrefix}${project.sub_domain}.${rootDomain}` : '#';
  const typeInfo = typeConfig[project.type] || typeConfig.portfolio;
  const createdDate = new Date(project.created_at).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="group relative flex min-h-[340px] flex-col border-4 border-black bg-white shadow-[6px_6px_0_#000] transition-all duration-200 hover:-translate-y-1 hover:shadow-[10px_10px_0_#000]">
      <div className="relative h-36 w-full overflow-hidden border-b-4 border-black bg-secondary/60">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:28px_28px] opacity-10" />
          <div
            className={cn(
              'flex h-16 w-16 items-center justify-center border-4 shadow-[5px_5px_0_#000]',
              typeInfo.color
            )}
          >
            <typeInfo.icon className="h-6 w-6 opacity-90" />
          </div>
        </div>

        <div className="absolute right-3 top-3">
          <Badge
            variant="secondary"
            className={cn(
              'rounded-none border-2 border-black px-2 py-1 font-mono text-[10px] font-black uppercase tracking-wider',
              project.published ? 'bg-secondary text-black' : 'bg-white text-black'
            )}
          >
            {project.published ? 'Published' : 'Draft'}
          </Badge>
        </div>
      </div>

      <div className="flex flex-grow flex-col p-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="space-y-1">
            <Link
              href={`/dashboard/builder/${typeInfo.projectName}/${project.slug}`}
              className="block text-xl font-black uppercase leading-tight tracking-normal text-black transition-colors group-hover:text-primary"
            >
              {project.name}
            </Link>

            {project.sub_domain && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition-colors hover:text-black group/link"
                onClick={(event) => event.stopPropagation()}
              >
                <Globe className="h-3 w-3" />
                <span>{liveUrl}</span>
                <ArrowUpRight className="h-2.5 w-2.5 -translate-y-0.5 translate-x-0.5 opacity-0 transition-all group-hover/link:opacity-100" />
              </a>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-mr-2 h-8 w-8 rounded-none text-muted-foreground/70 hover:bg-secondary hover:text-black"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-none border-2 border-black shadow-[5px_5px_0_#000]"
            >
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/builder/${project.type}/${project.slug}`} className="cursor-pointer">
                  <Layout className="mr-2 h-4 w-4 text-muted-foreground" /> Open Builder
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(project)} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4 text-muted-foreground" /> Edit Details
              </DropdownMenuItem>
              {project.sub_domain && (
                <DropdownMenuItem asChild>
                  <a href={liveUrl} target="_blank" rel="noreferrer" className="cursor-pointer">
                    <ExternalLink className="mr-2 h-4 w-4 text-muted-foreground" /> View Live Site
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(project.id)}
                className="cursor-pointer text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="mb-6 line-clamp-2 text-sm font-semibold leading-relaxed text-muted-foreground">
          {project.description || 'No description provided.'}
        </p>

        <div className="mt-auto flex items-center justify-between border-t-2 border-black pt-4 text-xs font-bold text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 opacity-70" />
            <span>{createdDate}</span>
          </div>

          <div className="flex items-center gap-1.5 font-black uppercase text-primary opacity-0 transition-opacity group-hover:opacity-100">
            <span>Manage</span>
            <ArrowUpRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
