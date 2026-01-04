"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Cpu,
  Network,
  TerminalSquare,
  Zap,
  Send,
  AlertCircle,
  Scan,
  Activity,
  ChevronRight,
  Facebook,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mode } from "@/contexts/settings-context";
import { useMemo, useState } from "react";
import { ThemeSwitchToggle } from "../theme-switch-toggle";
import Link from "next/link";
import { ThemeStyles } from "@/types/theme";
import {
  AppointmentFormValues,
  AppointmentSchema,
} from "@/lib/schemas/appointment";
import {
  CreateAppointmentPayload,
  useAppointment,
} from "@/hooks/api/use-appointment";
import { usePageActivity } from "@/hooks/api/use-page-activity";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Project } from "@/types/project";
import { Portfolio } from "@/types/portfolio";

// --- Types ---
interface Props {
  project: Project;
  portfolio: Portfolio;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
  themeStyles: ThemeStyles;
}

// --- Cyberpunk Styles & Helpers ---
const cyberClipStyle = {
  clipPath: "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)",
};

const cyberPanelClass = `
  relative 
  bg-background/80 
  border border-primary/30 
  backdrop-blur-md 
  before:absolute before:top-0 before:left-0 before:w-3 before:h-3 before:border-t-2 before:border-l-2 before:border-primary
  after:absolute after:bottom-0 after:right-0 after:w-3 after:h-3 after:border-b-2 after:border-r-2 after:border-primary
  hover:border-primary/60 transition-colors duration-300
  shadow-[0_0_10px_rgba(0,0,0,0.1)]
`;

const cyberButtonClass = `
  relative overflow-hidden group font-mono uppercase tracking-widest text-xs font-bold
  bg-primary text-primary-foreground
  hover:bg-primary/90 transition-all
  clip-path-polygon-[0_0,_100%_0,_100%_80%,_90%_100%,_0_100%]
`;

// --- Sub-Components ---

const HeroSection = ({
  portfolio,
  themeMode,
  onSetThemeMode,
  isDarkMode,
}: {
  portfolio: Portfolio;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
  isDarkMode: boolean;
}) => {
  const socialLinks = useMemo(() => {
    return [
      { type: "github", url: portfolio.github, icon: Github },
      { type: "linkedin", url: portfolio.linkedin, icon: Linkedin },
      { type: "twitter", url: portfolio.twitter, icon: Twitter },
      { type: "website", url: portfolio.website, icon: Globe },
    ].filter((link) => link.url);
  }, [portfolio]);

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-primary/20 pb-6 relative">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-mono text-primary uppercase tracking-[0.2em]">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>System_Online</span>
          <span className="opacity-50">::</span>
          <span>V.2.0.45</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
          {portfolio.name || "Unknown_User"}
        </h1>
        <div className="flex items-center gap-3 font-mono text-sm md:text-base text-muted-foreground">
          {portfolio.job_title && (
            <span className="bg-primary/10 px-2 py-0.5 border-l-2 border-primary text-primary font-bold">
              {portfolio.job_title}
            </span>
          )}
          {portfolio.location && (
            <>
              <span>//</span>
              <span>{portfolio.location}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-4">
        <ThemeSwitchToggle
          isDarkMode={isDarkMode}
          onSetThemeMode={onSetThemeMode}
        />
        {socialLinks.length > 0 && (
          <div className="flex gap-2">
            {socialLinks.map((link, i) => (
              <Link key={i} href={link.url!} target="_blank">
                <Button
                  size="icon"
                  variant="outline"
                  className="border-primary/30 hover:bg-primary hover:text-primary-foreground rounded-none transition-all relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
                  <link.icon className="w-4 h-4 relative z-10" />
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

const IdCardSection = ({ portfolio }: { portfolio: Portfolio }) => {
  const expYears = useMemo(() => {
    if (!portfolio.work_experiences || portfolio.work_experiences.length === 0)
      return "N/A";
    // Simple logic to find the earliest year
    const years = portfolio.work_experiences
      .map((exp) => parseInt(exp.start_date.match(/\d{4}/)?.[0] || "9999"))
      .sort();
    const start = years[0];
    if (start === 9999) return "N/A";
    return new Date().getFullYear() - start;
  }, [portfolio.work_experiences]);

  return (
    <div
      className={
        cyberPanelClass + " p-6 flex flex-col items-center text-center"
      }
    >
      <div className="relative mb-6 group">
        <div className="absolute inset-0 rounded-full border border-dashed border-primary animate-[spin_10s_linear_infinite]" />
        <Avatar className="w-40 h-40 border-4 border-background relative z-10">
          <AvatarImage
            src={portfolio.user.image_url}
            className="object-cover"
          />
          <AvatarFallback className="text-4xl bg-muted font-black">
            {portfolio.name?.charAt(0) ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground text-[10px] px-2 py-1 font-mono font-bold uppercase tracking-widest">
          Operator
        </div>
      </div>

      {portfolio.introduction && (
        <p className="text-sm leading-relaxed text-muted-foreground font-mono">
          {portfolio.introduction}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2 w-full mt-6">
        <div className="bg-primary/5 p-2 text-center border border-primary/10">
          <div className="text-xs text-muted-foreground uppercase">
            Projects
          </div>
          <div className="text-xl font-bold font-mono">
            {portfolio.showcases?.length || 0}
          </div>
        </div>
        <div className="bg-primary/5 p-2 text-center border border-primary/10">
          <div className="text-xs text-muted-foreground uppercase">Exp_Yrs</div>
          <div className="text-xl font-bold font-mono">{expYears}</div>
        </div>
      </div>
    </div>
  );
};

const SkillsSection = ({ portfolio }: { portfolio: Portfolio }) => {
  if (!portfolio.skills || portfolio.skills.length === 0) return null;

  return (
    <div className={cyberPanelClass + " p-6"}>
      <h3 className="font-mono uppercase font-bold text-primary mb-4 flex items-center gap-2">
        <Cpu className="w-4 h-4" /> Skill_Set_Matrix
      </h3>
      <div className="flex flex-wrap gap-2">
        {portfolio.skills.map((skill) => (
          <div key={skill.id} className="relative group">
            <div className="absolute inset-0 bg-primary blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />
            <Badge
              variant="outline"
              className="relative border-primary/40 text-foreground rounded-none px-3 py-1 font-mono text-xs hover:bg-primary hover:text-primary-foreground cursor-default transition-colors"
            >
              {skill.name}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactFormSection = ({
  portfolio,
  project,
}: {
  portfolio: Portfolio;
  project: Project;
}) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { create } = useAppointment();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      name: "",
      contact_number: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (form: AppointmentFormValues) => {
    if (!portfolio?.user?.id || !project?.id) {
      setError("Configuration error: Missing ID.");
      return;
    }

    setError("");
    setIsLoading(true);

    const payload: CreateAppointmentPayload = {
      user_id: portfolio.user.id,
      project_id: project.id,
      name: form.name,
      email: form.email,
      contact_number: form.contact_number,
      message: form.message,
    };

    const { success, data, message } = await create(payload);

    if (success && data) {
      toast("Transmission success.");
      setIsLoading(false);
      reset();
      return;
    }

    setError(message || "Transmission failed.");
    toast("System Error: Transmission failed.");
    setIsLoading(false);
  };

  return (
    <div className={cyberPanelClass + " p-6"}>
      <div className="absolute top-0 right-0 p-2 opacity-20">
        <Scan className="w-12 h-12" />
      </div>
      <h3 className="font-mono uppercase font-bold text-primary mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4" /> Comms_Link
      </h3>

      {error && (
        <Alert
          variant="destructive"
          className="mb-4 rounded-none border-l-4 border-l-destructive bg-destructive/10"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-mono text-xs uppercase">
            Error: {error}
          </AlertTitle>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-[10px] uppercase font-mono tracking-wider opacity-70">
            Identity
          </Label>
          <Input
            {...register("name")}
            className="bg-background/50 border-primary/30 rounded-none focus-visible:ring-1 focus-visible:ring-primary font-mono text-sm"
            placeholder="ENTER_NAME"
          />
          {errors.name && (
            <p className="text-xs text-red-500 font-mono mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] uppercase font-mono tracking-wider opacity-70">
            Coordinates (Email)
          </Label>
          <Input
            {...register("email")}
            type="email"
            className="bg-background/50 border-primary/30 rounded-none focus-visible:ring-1 focus-visible:ring-primary font-mono text-sm"
            placeholder="ENTER_EMAIL"
          />
          {errors.email && (
            <p className="text-xs text-red-500 font-mono mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] uppercase font-mono tracking-wider opacity-70">
            Frequency (Phone)
          </Label>
          <Input
            {...register("contact_number")}
            className="bg-background/50 border-primary/30 rounded-none focus-visible:ring-1 focus-visible:ring-primary font-mono text-sm"
            placeholder="OPTIONAL"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] uppercase font-mono tracking-wider opacity-70">
            Data_Packet
          </Label>
          <Textarea
            {...register("message")}
            className="bg-background/50 border-primary/30 rounded-none focus-visible:ring-1 focus-visible:ring-primary font-mono text-sm min-h-[100px] resize-none"
            placeholder="MESSAGE_CONTENT..."
          />
          {errors.message && (
            <p className="text-xs text-red-500 font-mono mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          className={cyberButtonClass + " w-full h-12 mt-2"}
          style={cyberClipStyle}
        >
          <span className="relative z-10 flex items-center gap-2">
            {isLoading ? (
              <>
                UPLOADING... <Loader2 className="h-3 w-3 animate-spin" />
              </>
            ) : (
              <>
                INITIATE_TRANSFER <Send className="w-3 h-3" />
              </>
            )}
          </span>
        </Button>
      </div>
    </div>
  );
};

const AboutSection = ({ portfolio }: { portfolio: Portfolio }) => {
  if (!portfolio.about) return null;

  return (
    <section className="relative pl-6 border-l border-primary/20">
      <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] bg-primary rounded-full animate-pulse" />
      <h2 className="text-2xl font-black uppercase mb-4 tracking-tight">
        System_Log // About
      </h2>
      <div className="prose dark:prose-invert max-w-none font-sans text-muted-foreground">
        {portfolio.about}
      </div>
    </section>
  );
};

const ProjectsSection = ({
  portfolio,
  projectId,
}: {
  portfolio: Portfolio;
  projectId: number;
}) => {
  const { trackPageProjectClick } = usePageActivity();

  if (!portfolio.showcases || portfolio.showcases.length === 0) return null;

  const handleTrackClick = (modelId: number) => {
    trackPageProjectClick(projectId, modelId);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6 border-b border-primary/20 pb-2">
        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
          <Network className="w-6 h-6 text-primary" /> Deployed_Units
        </h2>
        <span className="font-mono text-xs text-primary animate-pulse">
          STATUS: ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portfolio.showcases.map((project) => (
          <Link
            key={project.id}
            href={project.url || "#"}
            target={project.url ? "_blank" : undefined}
            onClick={() => handleTrackClick(project.id)}
            className={`block group h-full ${!project.url ? "pointer-events-none" : ""}`}
          >
            <div
              className={`${cyberPanelClass} p-5 h-full flex flex-col group-hover:bg-primary/5`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg uppercase truncate pr-4">
                  {project.name}
                </h3>
                {project.url && (
                  <ExternalLink className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              {project.description && (
                <p className="text-sm text-muted-foreground font-mono mb-4 flex-1 line-clamp-3">
                  {project.description}
                </p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-auto">
                  {project.technologies.slice(0, 3).map((t) => (
                    <span
                      key={t.id}
                      className="text-[10px] font-mono border border-foreground/20 px-1 py-0.5 text-foreground/70"
                    >
                      {t.name}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-[10px] font-mono border border-foreground/20 px-1 py-0.5 text-foreground/70">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

const ExperienceSection = ({ portfolio }: { portfolio: Portfolio }) => {
  if (!portfolio.work_experiences || portfolio.work_experiences.length === 0)
    return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-6 border-b border-primary/20 pb-2">
        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
          <TerminalSquare className="w-6 h-6 text-primary" /> Runtime_History
        </h2>
      </div>

      <div className="space-y-0">
        {portfolio.work_experiences.map((exp) => (
          <div
            key={exp.id}
            className="relative pl-8 pb-8 border-l border-primary/20 last:pb-0 last:border-0"
          >
            {/* Timeline Node */}
            <div className="absolute left-[-5px] top-1 w-[9px] h-[9px] bg-background border-2 border-primary rounded-full group-hover:bg-primary transition-colors" />

            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
              <h3 className="text-xl font-bold uppercase">{exp.role}</h3>
              <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 border border-primary/20">
                {exp.start_date || "N/A"} &gt;&gt; {exp.end_date || "Present"}
              </span>
            </div>
            <div className="text-sm font-mono text-primary/80 mb-2 flex items-center gap-2">
              <span>@{exp.company}</span>
              {exp.location && (
                <>
                  <span className="text-[10px] opacity-50">|</span>
                  <span>{exp.location}</span>
                </>
              )}
            </div>
            {exp.about && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {exp.about}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const EducationSection = ({ portfolio }: { portfolio: Portfolio }) => {
  if (!portfolio.education || portfolio.education.length === 0) return null;

  return (
    <section className="pt-8">
      <div className="flex items-center justify-between mb-6 border-b border-primary/20 pb-2">
        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
          <ChevronRight className="w-6 h-6 text-primary" /> Data_Uploads
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {portfolio.education.map((edu) => (
          <div
            key={edu.id}
            className="bg-muted/30 p-4 border-l-4 border-muted hover:border-primary transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold">{edu.school}</div>
                {edu.degree && (
                  <div className="text-sm opacity-80">{edu.degree}</div>
                )}
              </div>
              <div className="font-mono text-xs opacity-60 text-right">
                {edu.year_start || "N/A"} - {edu.year_end || "Present"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const FooterSection = ({ portfolio }: { portfolio: Portfolio }) => {
  const rootURL = process.env.NEXT_PUBLIC_ROOT_URL || "https://kislap.app";
  const githubURL =
    process.env.NEXT_PUBLIC_KISLAP_GITHUB_URL ||
    "https://github.com/sebas-tech/kislap";
  const facebookURL =
    process.env.NEXT_PUBLIC_KISLAP_FACEBOOK_URL || "https://facebook.com";

  return (
    <footer className="border-t border-primary/20 pt-12 mt-12 ">
      <div className="flex flex-col items-center justify-center gap-6 text-center px-4">
        <div className="space-y-1 font-mono text-xs">
          <p className="text-primary/70 mb-2 tracking-widest">
            SYSTEM_END_OF_LINE
          </p>
          <p className="opacity-50">
            © {new Date().getFullYear()} {portfolio?.name || "My Portfolio"}.
            SECURE_CONNECTION.
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            All rights reserved. Made with{" "}
            <span className="text-red-500 animate-pulse">❤️</span>
          </p>
        </div>

        <div className="w-24 h-px bg-primary/30" />

        <div className="flex flex-col items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold tracking-widest text-primary uppercase flex items-center gap-1.5 font-mono">
              <span className="text-amber-400">✨</span> Powered by Kislap
            </span>
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-mono">
              Transform your forms into beautiful websites
            </p>
          </div>

          <div className="flex items-center gap-4 mt-1">
            <a
              href={githubURL}
              target="_blank"
              rel="noreferrer"
              className="text-primary/60 hover:text-primary transition-colors"
              title="Kislap Github"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={rootURL}
              target="_blank"
              rel="noreferrer"
              className="text-primary/60 hover:text-primary transition-colors"
              title="Kislap Website"
            >
              <Globe className="w-4 h-4" />
            </a>
            <a
              href={facebookURL}
              target="_blank"
              rel="noreferrer"
              className="text-primary/60 hover:text-primary transition-colors"
              title="Kislap Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main Component ---

export function Cyber({
  project,
  portfolio,
  themeMode,
  onSetThemeMode,
}: Props) {
  const isDarkMode = useMemo(() => themeMode === "dark", [themeMode]);

  if (!portfolio) return null;

  return (
    <div className="min-h-screen relative font-sans text-foreground overflow-hidden selection:bg-primary selection:text-primary-foreground">
      {/* 1. CYBER GRID BACKGROUND */}
      <div className="fixed inset-0 -z-10 bg-background">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))",
          }}
        />
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(transparent 50%, rgba(0,0,0,0.5) 50%)",
            backgroundSize: "100% 4px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
        {/* HEADER: SYSTEM STATUS & NAV */}
        <HeroSection
          portfolio={portfolio}
          themeMode={themeMode}
          onSetThemeMode={onSetThemeMode}
          isDarkMode={isDarkMode}
        />

        {/* MAIN DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: AVATAR & STATS (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <IdCardSection portfolio={portfolio} />
            <SkillsSection portfolio={portfolio} />
            <ContactFormSection portfolio={portfolio} project={project} />
          </div>

          {/* RIGHT COLUMN: CONTENT (Span 8) */}
          <div className="lg:col-span-8 space-y-8">
            <AboutSection portfolio={portfolio} />
            <ProjectsSection portfolio={portfolio} projectId={project.id} />
            <ExperienceSection portfolio={portfolio} />
            <EducationSection portfolio={portfolio} />
          </div>
        </div>

        <FooterSection portfolio={portfolio} />
      </div>
    </div>
  );
}
