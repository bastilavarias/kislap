"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  AlertCircleIcon,
  ArrowUpRight,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Project } from "@/types/project";
import { Portfolio } from "@/types/portfolio";
import { cn } from "@/lib/utils";

// --- Types ---
interface Props {
  project: Project;
  portfolio: Portfolio;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
  themeStyles: ThemeStyles;
}

// --- Styles ---
const borderClass = "border-foreground/20 rounded-none shadow-none";

// --- Sub-Components ---

const Masthead = ({
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
  return (
    <header className="border-b-4 border-foreground/80 pb-6 mb-8 text-center relative">
      <div className="absolute top-0 right-0">
        <ThemeSwitchToggle
          isDarkMode={isDarkMode}
          onSetThemeMode={onSetThemeMode}
        />
      </div>
      <div className="border-b border-foreground/20 pb-1 mb-4 flex justify-between items-end">
        <span className="text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground">
          Vol. 01
        </span>
        <span className="text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span className="text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground">
          No. 42
        </span>
      </div>

      <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-none mb-2">
        The {portfolio.name ? portfolio.name.split(" ").pop() : "Daily"} Post
      </h1>
      <p className="text-xl md:text-2xl italic font-medium text-muted-foreground font-serif">
        "{portfolio.job_title}"
      </p>
    </header>
  );
};

const Sidebar = ({ portfolio }: { portfolio: Portfolio }) => {
  const socialLinks = useMemo(() => {
    return [
      { type: "github", url: portfolio.github, icon: Github },
      { type: "linkedin", url: portfolio.linkedin, icon: Linkedin },
      { type: "twitter", url: portfolio.twitter, icon: Twitter },
      { type: "website", url: portfolio.website, icon: Globe },
    ].filter((link) => link.url);
  }, [portfolio]);

  return (
    <div className="md:col-span-1 space-y-6">
      {/* PROFILE "MUGSHOT" */}
      <div className={cn("border-2 p-1", borderClass)}>
        <div className="relative aspect-square w-full grayscale contrast-125 hover:grayscale-0 transition-all duration-500">
          <Avatar className="w-full h-full rounded-none">
            <AvatarImage
              src={portfolio.user.image_url}
              className="object-cover"
            />
            <AvatarFallback className="text-4xl font-black rounded-none">
              {portfolio.name?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="pt-2 text-center border-t border-foreground/10 mt-1">
          <p className="text-[10px] uppercase font-sans font-bold tracking-widest text-muted-foreground">
            Editor-in-Chief
          </p>
          <p className="font-bold text-sm">{portfolio.name}</p>
        </div>
      </div>

      {/* CONTACT DETAILS */}
      <div className={cn("p-4 border", borderClass)}>
        <h3 className="font-sans font-black uppercase text-sm border-b-2 border-foreground mb-3 pb-1">
          Directory
        </h3>
        <div className="space-y-2 text-xs font-sans">
          {portfolio.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3" /> {portfolio.location}
            </div>
          )}
          {portfolio.email && (
            <div
              className="flex items-center gap-2 truncate"
              title={portfolio.email}
            >
              <Mail className="w-3 h-3" /> {portfolio.email}
            </div>
          )}
          {portfolio.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3" /> {portfolio.phone}
            </div>
          )}
          <div className="flex gap-2 mt-3 pt-2 border-t border-foreground/10 flex-wrap">
            {socialLinks.map((link, i) => (
              <Link key={i} href={link.url!} target="_blank">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-none hover:bg-foreground hover:text-background"
                >
                  <link.icon className="w-3 h-3" />
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* SKILLS TICKER */}
      {portfolio.skills && portfolio.skills.length > 0 && (
        <div className={cn("p-4 border", borderClass)}>
          <h3 className="font-sans font-black uppercase text-sm border-b-2 border-foreground mb-3 pb-1">
            Classifieds
          </h3>
          <p className="text-xs text-muted-foreground mb-2 italic">
            Skills & Expertise available for hire:
          </p>
          <div className="flex flex-wrap gap-x-1 gap-y-1 text-sm leading-tight">
            {portfolio.skills.map((skill, i) => (
              <span key={skill.id} className="font-bold">
                {skill.name}
                {i < portfolio.skills.length - 1 ? "," : "."}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MainContent = ({ portfolio }: { portfolio: Portfolio }) => {
  return (
    <div className="md:col-span-2 space-y-6">
      {/* HERO ARTICLE */}
      <div className="space-y-3 pb-6 border-b border-foreground/20">
        <h2 className="text-3xl md:text-4xl font-bold leading-tight">
          Breaking: {portfolio.job_title} Enters the Market with Fresh Ideas
        </h2>
        <div className="flex items-center gap-2 text-[10px] font-sans uppercase text-muted-foreground">
          <span>By {portfolio.name}</span>
          <span>•</span>
          <span>{portfolio.location || "Remote"}</span>
          <span>•</span>
          <span>2 Min Read</span>
        </div>
        {(portfolio.introduction || portfolio.about) && (
          <div className="text-lg leading-snug text-justify">
            <p className="first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-2 first-letter:mt-[-6px]">
              {portfolio.introduction || portfolio.about}
            </p>
            {portfolio.about && portfolio.about.length > 200 && (
              <p className="text-base leading-snug text-justify mt-2">
                {portfolio.about.substring(0, 300)}...{" "}
                <span className="font-bold italic text-xs">
                  [Continued on Pg. 2]
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* EXPERIENCE COLUMNS */}
      {portfolio.work_experiences && portfolio.work_experiences.length > 0 && (
        <div>
          <h3 className="font-sans font-black uppercase text-lg border-b-4 border-double border-foreground mb-4 py-1">
            Career History
          </h3>
          <div className="space-y-5">
            {portfolio.work_experiences.map((exp) => (
              <div key={exp.id} className="grid grid-cols-12 gap-2 group">
                <div className="col-span-3 text-right pr-3 border-r border-foreground/20">
                  <p className="font-sans text-xs font-bold">
                    {exp.start_date || "N/A"}
                  </p>
                  <p className="font-sans text-[10px] text-muted-foreground uppercase">
                    to {exp.end_date || "Present"}
                  </p>
                </div>
                <div className="col-span-9 pl-1">
                  <h4 className="font-bold text-lg leading-none">{exp.role}</h4>
                  <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                    <span className="text-sm italic font-medium">
                      {exp.company}
                    </span>
                    {exp.location && (
                      <span className="text-[10px] font-sans uppercase text-muted-foreground">
                        • {exp.location}
                      </span>
                    )}
                  </div>
                  {exp.about && (
                    <p className="text-sm leading-tight text-muted-foreground">
                      {exp.about}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const RightColumn = ({
  portfolio,
  project,
  projectId,
}: {
  portfolio: Portfolio;
  project: Project;
  projectId: number;
}) => {
  const { trackPageProjectClick } = usePageActivity();
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
      toast.success("Letter sent to editor.");
      setIsLoading(false);
      reset();
      return;
    }

    setError(message || "Transmission failed.");
    toast.error("Transmission failed.");
    setIsLoading(false);
  };

  const handleTrackClick = (modelId: number) => {
    trackPageProjectClick(project.id, modelId);
  };

  return (
    <div className="md:col-span-1 space-y-6">
      {/* PROJECTS LIST */}
      {portfolio.showcases && portfolio.showcases.length > 0 && (
        <div className={cn("p-4 bg-muted/30 border", borderClass)}>
          <h3 className="font-sans font-black uppercase text-sm border-b border-foreground mb-4 pb-1">
            Featured Projects
          </h3>
          <div className="space-y-4 divide-y divide-foreground/10">
            {portfolio.showcases.map((proj) => (
              <div key={proj.id} className="pt-3 first:pt-0">
                <Link
                  href={proj.url || "#"}
                  target="_blank"
                  className={`group block ${!proj.url ? "pointer-events-none" : ""}`}
                  onClick={() => handleTrackClick(proj.id)}
                >
                  <h4 className="font-bold text-base leading-tight group-hover:underline decoration-2 underline-offset-2">
                    {proj.name}
                    {proj.url && (
                      <ArrowUpRight className="inline w-3 h-3 ml-1 mb-1 opacity-50" />
                    )}
                  </h4>
                  {proj.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-3 leading-snug">
                      {proj.description}
                    </p>
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {proj.technologies.slice(0, 3).map((t) => (
                        <span
                          key={t.id}
                          className="text-[9px] font-sans uppercase border border-foreground/20 px-1"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDUCATION */}
      {portfolio.education && portfolio.education.length > 0 && (
        <div className="border-t-2 border-foreground pt-4">
          <h3 className="font-sans font-black uppercase text-sm mb-3">
            Education
          </h3>
          <ul className="space-y-3">
            {portfolio.education.map((edu) => (
              <li key={edu.id} className="text-sm">
                <div className="font-bold">{edu.school}</div>
                <div className="italic text-xs">{edu.degree}</div>
                <div className="font-sans text-[10px] text-muted-foreground">
                  {edu.year_start || "N/A"} - {edu.year_end || "Present"}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ADVERTISEMENT (CONTACT FORM) */}
      <div className="border-4 border-double border-foreground p-3 mt-8 bg-background">
        <div className="text-center border border-foreground p-3">
          <h3 className="font-sans font-black uppercase text-xl mb-1">
            We Want You!
          </h3>
          <p className="text-xs uppercase tracking-wide mb-4">
            To send a message
          </p>

          <div className="space-y-2 text-left">
            {error && (
              <div className="flex items-center gap-2 text-[10px] font-bold text-red-600 bg-red-100 p-1 mb-2">
                <AlertCircleIcon className="w-3 h-3" /> {error}
              </div>
            )}
            <Input
              {...register("name")}
              placeholder="NAME"
              className="h-8 text-xs rounded-none border-foreground focus-visible:ring-0 focus-visible:border-b-2"
            />
            {errors.name && (
              <span className="text-[10px] text-red-500">
                {errors.name.message}
              </span>
            )}

            <Input
              {...register("email")}
              placeholder="EMAIL"
              className="h-8 text-xs rounded-none border-foreground focus-visible:ring-0 focus-visible:border-b-2"
            />
            {errors.email && (
              <span className="text-[10px] text-red-500">
                {errors.email.message}
              </span>
            )}

            <Textarea
              {...register("message")}
              placeholder="MESSAGE..."
              className="min-h-[60px] text-xs rounded-none border-foreground focus-visible:ring-0 focus-visible:border-b-2 resize-none"
            />
            {errors.message && (
              <span className="text-[10px] text-red-500">
                {errors.message.message}
              </span>
            )}

            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="w-full rounded-none font-sans font-bold uppercase tracking-widest h-8 text-xs"
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Submit Query"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = ({ portfolio }: { portfolio: Portfolio }) => {
  return (
    <footer className="border-t py-4 mt-auto bg-muted/5">
      <div className="flex flex-col items-center justify-center gap-6 text-center px-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            © {new Date().getFullYear()} {portfolio?.name || "My Portfolio"}.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// --- Main Component ---

export function Newspaper({
  project,
  portfolio,
  themeMode,
  onSetThemeMode,
}: Props) {
  const isDarkMode = useMemo(() => themeMode === "dark", [themeMode]);

  if (!portfolio) return null;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-serif">
      <div className="max-w-6xl mx-auto space-y-6">
        <Masthead
          portfolio={portfolio}
          themeMode={themeMode}
          onSetThemeMode={onSetThemeMode}
          isDarkMode={isDarkMode}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          <Sidebar portfolio={portfolio} />
          <MainContent portfolio={portfolio} />
          <RightColumn
            portfolio={portfolio}
            project={project}
            projectId={project.id}
          />
        </div>

        <Footer portfolio={portfolio} />
      </div>
    </div>
  );
}
