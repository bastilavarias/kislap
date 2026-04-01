'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  ChefHat,
  Coffee,
  FileText,
  Globe,
  LayoutTemplate,
  Link as LinkIcon,
  Loader2,
  Megaphone,
  Palette,
  Presentation,
  Store,
  UserRound,
  UtensilsCrossed,
  Video,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useProject } from '@/hooks/api/use-project';
import { cn } from '@/lib/utils';
import {
  LAYOUT_OPTIONS,
  PROJECT_TYPE_COPY,
  STARTERS,
  THEME_OPTIONS,
  type BuilderLayoutOption,
  type BuilderStarter,
  type BuilderThemeOption,
  type StarterProjectType,
  getDefaultStarter,
  getStarterById,
} from '@/lib/project-starters';
import { ProjectTemplatePreview } from './project-template-preview';

const typeIcons: Record<StarterProjectType, React.ComponentType<{ className?: string }>> = {
  portfolio: LayoutTemplate,
  linktree: LinkIcon,
  menu: UtensilsCrossed,
};

const starterIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'resume-first': FileText,
  freelancer: BriefcaseBusiness,
  developer: Globe,
  creator: Video,
  'personal-brand': UserRound,
  'launch-links': Megaphone,
  cafe: Coffee,
  restaurant: ChefHat,
  'food-stall': Store,
};

function createSubdomainCandidate(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 63);
}

function isProjectType(value: string | null): value is StarterProjectType {
  return value === 'portfolio' || value === 'linktree' || value === 'menu';
}

function getCreateButtonCopy(type: StarterProjectType) {
  if (type === 'portfolio') return 'Create portfolio project';
  if (type === 'linktree') return 'Create link page';
  return 'Create menu project';
}

function getMenuStarterPreviewName(starterId: string) {
  if (starterId === 'restaurant') return 'Resto Express';
  if (starterId === 'food-stall') return 'Siomai Prince';
  return 'Cafe Moto';
}

function getPortfolioStarterPreviewName(starterId: string) {
  if (starterId === 'freelancer') return 'Mara Sison';
  if (starterId === 'developer') return 'Avery Navarro';
  return 'Avery Navarro';
}

function getLinktreeStarterPreviewName(starterId: string) {
  if (starterId === 'personal-brand') return 'Nika Valdez';
  if (starterId === 'launch-links') return 'Orbit Labs';
  return 'Mika Reyes';
}

function splitAudienceChips(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getSelectedCardStyle() {
  return {
    backgroundImage:
      'linear-gradient(rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.08))',
  } as const;
}

function OptionPill({
  option,
  isSelected,
  onClick,
}: {
  option: BuilderLayoutOption | BuilderThemeOption;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-2xl border px-4 py-3 text-left transition-all',
        isSelected
          ? 'border-primary bg-primary/10 text-foreground shadow-sm ring-1 ring-primary/20'
          : 'border-border/70 bg-background/70 text-muted-foreground hover:border-primary/30 hover:text-foreground'
      )}
    >
      <p className="text-sm font-semibold">{option.label}</p>
      <p className="mt-1 text-xs leading-relaxed">{option.description}</p>
    </button>
  );
}

export function ProjectCreationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { create } = useProject();

  const initialType = isProjectType(searchParams.get('type'))
    ? (searchParams.get('type') as StarterProjectType)
    : 'portfolio';
  const initialStarter = getStarterById(initialType, searchParams.get('starter'));

  const [projectType, setProjectType] = useState<StarterProjectType>(initialType);
  const [starterId, setStarterId] = useState(initialStarter.id);
  const [layoutName, setLayoutName] = useState(
    searchParams.get('layout') || initialStarter.defaults.layoutName
  );
  const [themePreset, setThemePreset] = useState(
    searchParams.get('theme') || initialStarter.defaults.themePreset
  );
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [subDomain, setSubDomain] = useState('');
  const [subDomainTouched, setSubDomainTouched] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  const typeCopy = PROJECT_TYPE_COPY[projectType];
  const starters = STARTERS[projectType];
  const layoutOptions = LAYOUT_OPTIONS[projectType];
  const themeOptions = THEME_OPTIONS[projectType];
  const selectedStarter = useMemo(
    () => getStarterById(projectType, starterId),
    [projectType, starterId]
  );

  useEffect(() => {
    if (!subDomainTouched) {
      setSubDomain(createSubdomainCandidate(name));
    }
  }, [name, subDomainTouched]);

  useEffect(() => {
    const defaultStarter = getStarterById(projectType, starterId);
    setStarterId(defaultStarter.id);
    setLayoutName(defaultStarter.defaults.layoutName);
    setThemePreset(defaultStarter.defaults.themePreset);
  }, [projectType]);

  const handleStarterChange = (starter: BuilderStarter) => {
    setStarterId(starter.id);
    setLayoutName(starter.defaults.layoutName);
    setThemePreset(starter.defaults.themePreset);
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Project name is required.');
      return;
    }

    if (!subDomain.trim()) {
      toast.error('Subdomain is required.');
      return;
    }

    setIsCreating(true);
    const response = await create({
      name: name.trim(),
      description: description.trim(),
      sub_domain: subDomain.trim(),
      type: projectType,
      published: false,
    });

    if (response.success && response.data) {
      const nextUrl = new URL(
        `/dashboard/builder/${projectType}/${response.data.slug}`,
        window.location.origin
      );
      nextUrl.searchParams.set('starter', starterId);
      nextUrl.searchParams.set('layout', layoutName);
      nextUrl.searchParams.set('theme', themePreset);

      toast.success('Project created. Starter applied to your first draft.');
      router.push(`${nextUrl.pathname}${nextUrl.search}`);
      return;
    }

    toast.error(response.message || 'Failed to create project.');
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="xl:hidden">
        <Tabs value={mobileTab} onValueChange={(value) => setMobileTab(value as 'form' | 'preview')}>
          <TabsList className="grid h-12 w-full grid-cols-2 rounded-xl border border-border/70 bg-card p-1">
            <TabsTrigger value="form" className="rounded-lg">
              Form
            </TabsTrigger>
            <TabsTrigger value="preview" className="rounded-lg">
              Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid min-w-0 gap-8 xl:grid-cols-[460px_minmax(0,1fr)]">
      <section
        className={cn(
          'min-w-0 space-y-8',
          mobileTab === 'preview' ? 'hidden xl:block' : 'block'
        )}
      >
        <div className="space-y-4">
          <Button asChild variant="ghost" className="w-fit px-0 text-muted-foreground">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to projects
            </Link>
          </Button>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              New project
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Create a page with a clearer starting point.
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              Choose what you want to publish, pick a starter, and we’ll show you the kind of
              layout and theme you’re getting before the project even exists.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <LayoutTemplate className="h-4 w-4 text-primary" />
              What are you building?
            </div>
            <div className="grid gap-3">
              {(Object.keys(PROJECT_TYPE_COPY) as StarterProjectType[]).map((type) => {
                const Icon = typeIcons[type];

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setProjectType(type)}
                    className={cn(
                      'rounded-[1.5rem] border p-4 text-left transition-all',
                      projectType === type
                        ? 'border-primary bg-card shadow-sm ring-1 ring-primary/20'
                        : 'border-border/70 bg-card hover:border-primary/30 hover:bg-card'
                    )}
                    style={projectType === type ? getSelectedCardStyle() : undefined}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'rounded-2xl border p-3 text-primary transition-colors',
                          projectType === type
                            ? 'border-primary/20 bg-primary/15'
                            : 'border-primary/10 bg-primary/5'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-foreground">{PROJECT_TYPE_COPY[type].title}</p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {PROJECT_TYPE_COPY[type].description}
                        </p>
                        <div className="pt-2 flex flex-wrap gap-2">
                          {splitAudienceChips(PROJECT_TYPE_COPY[type].bestFor).map((audience) => (
                            <span
                              key={`${type}-${audience}`}
                              className="inline-flex items-center rounded-full border border-primary/15 bg-background px-3 py-1 text-[11px] font-medium tracking-[0.08em] text-muted-foreground"
                            >
                              {audience}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileText className="h-4 w-4 text-primary" />
              Pick a starter
            </div>
            <div className="grid gap-3">
              {starters.map((starter) => (
                <button
                  key={starter.id}
                  type="button"
                  onClick={() => handleStarterChange(starter)}
                  className={cn(
                    'rounded-[1.5rem] border p-4 text-left transition-all',
                    starterId === starter.id
                      ? 'border-primary bg-card shadow-sm ring-1 ring-primary/20'
                      : 'border-border/70 bg-card hover:border-primary/30 hover:bg-card'
                  )}
                  style={starterId === starter.id ? getSelectedCardStyle() : undefined}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'rounded-2xl border p-3 text-primary transition-colors',
                        starterId === starter.id
                          ? 'border-primary/20 bg-primary/15'
                          : 'border-primary/10 bg-primary/5'
                      )}
                    >
                      {(() => {
                        const StarterIcon = starterIcons[starter.id] || Presentation;
                        return <StarterIcon className="h-5 w-5" />;
                      })()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-semibold text-foreground">{starter.label}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {starter.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {splitAudienceChips(starter.bestFor)
                          .slice(0, 3)
                          .map((audience) => (
                        <span
                          key={`${starter.id}-${audience}`}
                          className="inline-flex items-center rounded-full border border-primary/15 bg-background px-3 py-1 text-[11px] font-medium tracking-[0.08em] text-muted-foreground"
                        >
                          {audience}
                        </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <LayoutTemplate className="h-4 w-4 text-primary" />
                Layout
              </div>
              <div className="grid gap-3">
                {layoutOptions.map((layoutOption) => (
                  <OptionPill
                    key={layoutOption.id}
                    option={layoutOption}
                    isSelected={layoutName === layoutOption.id}
                    onClick={() => setLayoutName(layoutOption.id)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Palette className="h-4 w-4 text-primary" />
                Theme
              </div>
              <div className="grid gap-3">
                {themeOptions.map((themeOption) => (
                  <OptionPill
                    key={themeOption.id}
                    option={themeOption}
                    isSelected={themePreset === themeOption.id}
                    onClick={() => setThemePreset(themeOption.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-[1.75rem] border border-border/70 bg-card/70 p-6">
            <div>
              <p className="text-sm font-semibold text-foreground">Project basics</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Keep this light. We only need enough to create the project and route you into the builder.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-name">Project name</Label>
              <Input
                id="project-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={
                  projectType === 'menu'
                    ? getMenuStarterPreviewName(starterId)
                    : projectType === 'linktree'
                      ? getLinktreeStarterPreviewName(starterId)
                      : getPortfolioStarterPreviewName(starterId)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-subdomain">Public URL</Label>
              <div className="relative">
                <Input
                  id="project-subdomain"
                  value={subDomain}
                  onChange={(event) => {
                    setSubDomainTouched(true);
                    setSubDomain(createSubdomainCandidate(event.target.value));
                  }}
                  placeholder="john-doe"
                  className="pr-28"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  .kislap.app
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={`What is this ${typeCopy.label.toLowerCase()} for?`}
                className="min-h-28 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border/60 pt-6">
          <Button
            type="button"
            size="lg"
            onClick={handleCreate}
            disabled={isCreating}
            className="h-12 rounded-full"
          >
            {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {getCreateButtonCopy(projectType)}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-sm text-muted-foreground">
            We’ll create the project, take you into the builder, and prefill the first draft from{' '}
            <span className="font-medium text-foreground">{selectedStarter.label}</span>.
          </p>
        </div>
      </section>

      <section
        className={cn(
          'min-w-0 max-w-full xl:sticky xl:top-24 xl:h-[calc(100vh-8rem)]',
          mobileTab === 'form' ? 'hidden xl:block' : 'block'
        )}
      >
        <ProjectTemplatePreview
          type={projectType}
          starterId={starterId}
          layoutName={layoutName}
          themePreset={themePreset}
          projectName={
            name.trim() ||
            (projectType === 'menu'
              ? getMenuStarterPreviewName(starterId)
              : projectType === 'portfolio'
                ? getPortfolioStarterPreviewName(starterId)
                : getLinktreeStarterPreviewName(starterId))
          }
        />
      </section>
      </div>
    </div>
  );
}
