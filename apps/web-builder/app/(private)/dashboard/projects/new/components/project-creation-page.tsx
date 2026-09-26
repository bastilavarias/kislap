'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Loader2,
  Palette,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProject } from '@/hooks/api/use-project';
import { cn } from '@/lib/utils';
import {
  builderButtonClass,
  builderTabsListClass,
  builderTabsTriggerClass,
} from '@/components/builder/builder-ui';
import {
  STARTERS,
  THEME_OPTIONS,
  type BuilderStarter,
  type StarterProjectType,
  getStarterById,
} from '@/lib/project-starters';
import { ProjectTemplatePreview } from './project-template-preview';
import {
  OptionPill,
  createSubdomainCandidate,
  getCreateButtonCopy,
  getLinktreeStarterPreviewName,
  StarterSelector,
} from './project-creation-options';
import { ProjectBasicsPanel } from './project-basics-panel';

export function ProjectCreationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { create } = useProject();

  const projectType: StarterProjectType = 'linktree';
  const initialStarter = getStarterById(projectType, searchParams.get('starter'));
  const requestedTheme = searchParams.get('theme');
  const initialTheme = THEME_OPTIONS[projectType].some((option) => option.id === requestedTheme)
    ? requestedTheme!
    : initialStarter.defaults.themePreset;

  const [starterId, setStarterId] = useState(initialStarter.id);
  const [themePreset, setThemePreset] = useState(initialTheme);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [subDomain, setSubDomain] = useState('');
  const [subDomainTouched, setSubDomainTouched] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  const starters = STARTERS[projectType];
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

  const handleStarterChange = (starter: BuilderStarter) => {
    setStarterId(starter.id);
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
      nextUrl.searchParams.set('theme', themePreset);

      toast.success('Page created. Starter applied to your first draft.');
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
          <TabsList className={cn('grid h-12 w-full grid-cols-2', builderTabsListClass)}>
            <TabsTrigger value="form" className={builderTabsTriggerClass}>
              Form
            </TabsTrigger>
            <TabsTrigger value="preview" className={builderTabsTriggerClass}>
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
          <Button asChild variant="ghost" className="w-fit rounded-none px-0 font-black uppercase text-muted-foreground hover:text-black">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to projects
            </Link>
          </Button>

          <div className="space-y-3">
            <p className="font-mono text-sm font-black uppercase tracking-[0.24em] text-primary">
              New page
            </p>
            <h1 className="text-4xl font-black uppercase leading-none tracking-normal text-foreground md:text-5xl">
              Build your Kislap page.
            </h1>
            <p className="text-base font-semibold leading-relaxed text-muted-foreground">
              Pick a starting point and color theme, then shape the page with your own blocks and
              layout inside the builder.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-mono text-sm font-black uppercase tracking-[0.18em] text-foreground">
              <FileText className="h-4 w-4 text-primary" />
              Pick a starter
            </div>
            <StarterSelector
              starterId={starterId}
              starters={starters}
              onChange={handleStarterChange}
            />
          </div>

          <div className="space-y-3">
              <div className="flex items-center gap-2 font-mono text-sm font-black uppercase tracking-[0.18em] text-foreground">
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

          <ProjectBasicsPanel
            starterId={starterId}
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            subDomain={subDomain}
            setSubDomain={setSubDomain}
            setSubDomainTouched={setSubDomainTouched}
          />
        </div>

        <div className="flex flex-col gap-3 border-t-4 border-black pt-6">
          <Button
            type="button"
            size="lg"
            onClick={handleCreate}
            disabled={isCreating}
            className={cn('h-12', builderButtonClass)}
          >
            {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {getCreateButtonCopy(projectType)}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-sm font-semibold text-muted-foreground">
            We will create the page, take you into the builder, and prefill the first draft from{' '}
            <span className="font-black text-foreground">{selectedStarter.label}</span>.
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
          layoutName="linktree-default"
          themePreset={themePreset}
          projectName={name.trim() || getLinktreeStarterPreviewName(starterId)}
        />
      </section>
      </div>
    </div>
  );
}
