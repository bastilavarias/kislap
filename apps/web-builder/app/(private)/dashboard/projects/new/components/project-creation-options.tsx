import {
  BriefcaseBusiness,
  ChefHat,
  Coffee,
  FileText,
  Globe,
  LayoutTemplate,
  Link as LinkIcon,
  Megaphone,
  Presentation,
  Store,
  UserRound,
  UtensilsCrossed,
  Video,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PROJECT_TYPE_COPY,
  type BuilderStarter,
  type BuilderLayoutOption,
  type BuilderThemeOption,
  type StarterProjectType,
} from '@/lib/project-starters';

export const typeIcons: Record<
  StarterProjectType,
  React.ComponentType<{ className?: string }>
> = {
  portfolio: LayoutTemplate,
  linktree: LinkIcon,
  menu: UtensilsCrossed,
};

export const starterIcons: Record<string, React.ComponentType<{ className?: string }>> = {
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

export function createSubdomainCandidate(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 63);
}

export function isProjectType(value: string | null): value is StarterProjectType {
  return value === 'portfolio' || value === 'linktree' || value === 'menu';
}

export function getCreateButtonCopy(type: StarterProjectType) {
  if (type === 'portfolio') return 'Create portfolio project';
  if (type === 'linktree') return 'Create link page';
  return 'Create menu project';
}

export function getMenuStarterPreviewName(starterId: string) {
  if (starterId === 'restaurant') return 'Resto Express';
  if (starterId === 'food-stall') return 'Siomai Prince';
  return 'Cafe Moto';
}

export function getPortfolioStarterPreviewName(starterId: string) {
  if (starterId === 'freelancer') return 'Mara Sison';
  if (starterId === 'developer') return 'Avery Navarro';
  return 'Avery Navarro';
}

export function getLinktreeStarterPreviewName(starterId: string) {
  if (starterId === 'personal-brand') return 'Nika Valdez';
  if (starterId === 'launch-links') return 'Orbit Labs';
  return 'Mika Reyes';
}

export function splitAudienceChips(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getSelectedCardStyle() {
  return {
    backgroundImage:
      'linear-gradient(rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.08))',
  } as const;
}

export function OptionPill({
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
        'border-2 border-black px-4 py-3 text-left transition-all',
        isSelected
          ? 'bg-secondary text-black shadow-[4px_4px_0_#000]'
          : 'bg-white text-muted-foreground hover:bg-black hover:text-white'
      )}
    >
      <p className="text-sm font-black uppercase">{option.label}</p>
      <p className="mt-1 text-xs font-semibold leading-relaxed">{option.description}</p>
    </button>
  );
}

export function ProjectTypeSelector({
  projectType,
  onChange,
}: {
  projectType: StarterProjectType;
  onChange: (type: StarterProjectType) => void;
}) {
  return (
    <div className="grid gap-3">
      {(Object.keys(PROJECT_TYPE_COPY) as StarterProjectType[]).map((type) => {
        const Icon = typeIcons[type];

        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={cn(
              'border-4 border-black p-4 text-left transition-all',
              projectType === type
                ? 'bg-secondary shadow-[5px_5px_0_#000]'
                : 'bg-white hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#000]'
            )}
            style={projectType === type ? getSelectedCardStyle() : undefined}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  'border-2 border-black p-3 transition-colors',
                  projectType === type ? 'bg-black text-white' : 'bg-secondary text-black'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-black uppercase text-foreground">
                  {PROJECT_TYPE_COPY[type].title}
                </p>
                <p className="text-sm font-semibold leading-relaxed text-muted-foreground">
                  {PROJECT_TYPE_COPY[type].description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {splitAudienceChips(PROJECT_TYPE_COPY[type].bestFor).map((audience) => (
                    <span
                      key={`${type}-${audience}`}
                      className="inline-flex items-center border-2 border-black bg-white px-3 py-1 font-mono text-[11px] font-black uppercase tracking-[0.08em] text-black"
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
  );
}

export function StarterSelector({
  starterId,
  starters,
  onChange,
}: {
  starterId: string;
  starters: BuilderStarter[];
  onChange: (starter: BuilderStarter) => void;
}) {
  return (
    <div className="grid gap-3">
      {starters.map((starter) => {
        const StarterIcon = starterIcons[starter.id] || Presentation;

        return (
          <button
            key={starter.id}
            type="button"
            onClick={() => onChange(starter)}
            className={cn(
              'border-4 border-black p-4 text-left transition-all',
              starterId === starter.id
                ? 'bg-secondary shadow-[5px_5px_0_#000]'
                : 'bg-white hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#000]'
            )}
            style={starterId === starter.id ? getSelectedCardStyle() : undefined}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  'border-2 border-black p-3 transition-colors',
                  starterId === starter.id ? 'bg-black text-white' : 'bg-secondary text-black'
                )}
              >
                <StarterIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-black uppercase text-foreground">{starter.label}</p>
                <p className="mt-1 text-sm font-semibold leading-relaxed text-muted-foreground">
                  {starter.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {splitAudienceChips(starter.bestFor)
                    .slice(0, 3)
                    .map((audience) => (
                      <span
                        key={`${starter.id}-${audience}`}
                        className="inline-flex items-center border-2 border-black bg-white px-3 py-1 font-mono text-[11px] font-black uppercase tracking-[0.08em] text-black"
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
  );
}
