"use client";

import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Linkedin,
  Twitter,
  Globe,
  ArrowUpRight,
  Mail,
  Loader2,
  MapPin,
  Facebook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mode } from "@/contexts/settings-context";
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
import { usePageActivity } from "@/hooks/api/use-page-activity"; // Imported for tracking
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Project } from "@/types/project";
import { Portfolio } from "@/types/portfolio";

interface Props {
  project: Project;
  portfolio: Portfolio;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
  themeStyles: ThemeStyles;
}

const HeroSection = ({
  portfolio,
  themeMode,
  onSetThemeMode,
}: {
  portfolio: Portfolio;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
}) => {
  const isDarkMode = useMemo(() => themeMode === "dark", [themeMode]);

  const socialLinks = useMemo(() => {
    return [
      { type: "github", url: portfolio?.github, icon: Github },
      { type: "linkedin", url: portfolio?.linkedin, icon: Linkedin },
      { type: "twitter", url: portfolio?.twitter, icon: Twitter },
      { type: "website", url: portfolio?.website, icon: Globe },
    ].filter((link) => link.url);
  }, [portfolio]);

  return (
    <header className="space-y-8">
      <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-6 md:gap-8">
        <div className="space-y-4 flex-1 w-full">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              {portfolio?.name || "Untitled Portfolio"}
            </h1>
            {portfolio?.job_title && (
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium">
                {portfolio.job_title}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {portfolio?.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{portfolio.location}</span>
              </div>
            )}
            {portfolio?.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 shrink-0" />
                <span className="break-all">{portfolio.email}</span>
              </div>
            )}
          </div>

          {socialLinks.length > 0 && (
            <div className="flex justify-center md:justify-start gap-2 pt-2">
              {socialLinks.map((link: any, i: number) => (
                <Link key={i} href={link.url!} target="_blank">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <link.icon className="w-4 h-4" />
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
          <div className="md:hidden">
            <ThemeSwitchToggle
              isDarkMode={isDarkMode}
              onSetThemeMode={onSetThemeMode}
            />
          </div>

          {portfolio?.user?.image_url && (
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 border bg-muted">
              <AvatarImage
                src={portfolio.user.image_url}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl text-muted-foreground">
                {portfolio.name?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
          )}

          <div className="hidden md:block">
            <ThemeSwitchToggle
              isDarkMode={isDarkMode}
              onSetThemeMode={onSetThemeMode}
            />
          </div>
        </div>
      </div>

      {(portfolio?.about || portfolio?.introduction) && (
        <div className="max-w-3xl mx-auto md:mx-0">
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground text-center md:text-left">
            {portfolio.about || portfolio.introduction}
          </p>
        </div>
      )}
    </header>
  );
};

const ExperienceSection = ({ portfolio }: { portfolio: Portfolio }) => {
  if (!portfolio?.work_experiences || portfolio.work_experiences.length === 0)
    return null;

  return (
    <section className="space-y-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Experience
      </h2>
      <div className="space-y-8">
        {portfolio.work_experiences.map((exp) => (
          <div
            key={exp.id}
            className="group relative border-l-2 border-transparent hover:border-primary/20 pl-4 -ml-4 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2 gap-1">
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {exp.role}
              </h3>
              <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">
                {exp.start_date || "N/A"} — {exp.end_date || "Present"}
              </span>
            </div>
            <div className="text-sm text-muted-foreground mb-3 font-medium">
              {[exp.company, exp.location].filter(Boolean).join(" • ")}
            </div>
            {exp.about && (
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {exp.about}
              </p>
            )}
          </div>
        ))}
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

  if (!portfolio?.showcases || portfolio.showcases.length === 0) return null;

  const handleTrackClick = (modelID: number) => {
    trackPageProjectClick(projectId, modelID);
  };

  return (
    <section className="space-y-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {portfolio.showcases.map((project) => (
          <Link
            key={project.id}
            href={project.url || "#"}
            target={project.url ? "_blank" : undefined}
            onClick={() => handleTrackClick(project.id)}
            className={`group block h-full ${!project.url ? "pointer-events-none" : ""}`}
          >
            <div className="h-full rounded-lg border bg-card p-6 transition-all hover:shadow-md hover:border-primary/20 flex flex-col">
              <div className="flex justify-between items-start mb-3 gap-2">
                <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
                  {project.name}
                </h3>
                {project.url && (
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                )}
              </div>
              {project.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                  {project.description}
                </p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.technologies.slice(0, 4).map((t) => (
                    <Badge
                      key={t.id}
                      variant="secondary"
                      className="bg-secondary/50 text-secondary-foreground font-normal text-xs"
                    >
                      {t.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

const EducationSection = ({ portfolio }: { portfolio: Portfolio }) => {
  if (!portfolio?.education || portfolio.education.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Education
      </h2>
      <div className="space-y-4">
        {portfolio.education.map((edu) => (
          <div
            key={edu.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-border/40 last:border-0 gap-1"
          >
            <div>
              <div className="font-medium text-foreground">{edu.school}</div>
              {edu.degree && (
                <div className="text-sm text-muted-foreground">
                  {edu.degree}
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-1 sm:mt-0 font-medium whitespace-nowrap">
              {edu.year_start || "N/A"} - {edu.year_end || "Present"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const SkillsSection = ({ portfolio }: { portfolio: Portfolio }) => {
  if (!portfolio?.skills || portfolio.skills.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {portfolio.skills.map((skill) => (
          <Badge
            key={skill.id}
            variant="outline"
            className="px-3 py-1 text-sm font-normal border-border bg-background hover:bg-muted transition-colors"
          >
            {skill.name}
          </Badge>
        ))}
      </div>
    </section>
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
      toast.success("Message sent successfully.");
      setIsLoading(false);
      reset();
      return;
    }

    setError(message || "Failed to send message");
    toast.error("Failed to send message.");
    setIsLoading(false);
  };

  return (
    <section className="space-y-4 rounded-xl bg-muted/30 p-6 border border-border/50">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Get in Touch
      </h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <div className="text-sm">{error}</div>
        </Alert>
      )}

      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name" className="text-xs font-medium">
            Name
          </Label>
          <Input
            {...register("name")}
            id="name"
            className="bg-background border-border/60 focus-visible:ring-offset-0"
            placeholder="Your name"
          />
          {errors.name && (
            <p className="text-xs text-destructive mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className="text-xs font-medium">
            Email
          </Label>
          <Input
            {...register("email")}
            id="email"
            type="email"
            className="bg-background border-border/60 focus-visible:ring-offset-0"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="contact" className="text-xs font-medium">
            Phone (Optional)
          </Label>
          <Input
            {...register("contact_number")}
            id="contact"
            className="bg-background border-border/60 focus-visible:ring-offset-0"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="message" className="text-xs font-medium">
            Message
          </Label>
          <Textarea
            {...register("message")}
            id="message"
            className="bg-background border-border/60 min-h-[100px] resize-none focus-visible:ring-offset-0"
            placeholder="How can I help you?"
          />
          {errors.message && (
            <p className="text-xs text-destructive mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="w-full mt-2"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Message
        </Button>
      </div>
    </section>
  );
};

const FooterSection = ({ portfolio }: { portfolio: Portfolio }) => {
  const rootURL = process.env.NEXT_PUBLIC_ROOT_URL || "https://kislap.app";
  const githubURL =
    process.env.NEXT_PUBLIC_KISLAP_GITHUB_URL || "https://kislap.app";
  const facebookURL =
    process.env.NEXT_PUBLIC_KISLAP_FACEBOOK_URL || "https://kislap.app";

  return (
    <footer className="border-t py-12 mt-auto bg-muted/5">
      <div className="flex flex-col items-center justify-center gap-6 text-center px-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            © {new Date().getFullYear()} {portfolio?.name || "My Portfolio"}.
          </p>
          <p className="text-xs text-muted-foreground">
            All rights reserved. Made with{" "}
            <span className="text-red-500 animate-pulse">❤️</span>
          </p>
        </div>

        <div className="w-8 h-px bg-border/60" />

        <div className="flex flex-col items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1.5">
              <span className="text-amber-400">✨</span> Powered by Kislap
            </span>
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">
              Transform your forms into beautiful websites
            </p>
          </div>

          <div className="flex items-center gap-4 mt-1">
            <a
              href={githubURL}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Kislap Github"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={rootURL}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Kislap Website"
            >
              <Globe className="w-4 h-4" />
            </a>
            <a
              href={facebookURL}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
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

export function Default({
  project,
  portfolio,
  themeMode,
  onSetThemeMode,
}: Props) {
  if (!portfolio) return null;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 selection:text-primary font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-20 space-y-16 sm:space-y-20">
        <HeroSection
          portfolio={portfolio}
          themeMode={themeMode}
          onSetThemeMode={onSetThemeMode}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t pt-12">
          <div className="lg:col-span-8 space-y-16">
            <ExperienceSection portfolio={portfolio} />
            <ProjectsSection portfolio={portfolio} projectId={project.id} />
            <EducationSection portfolio={portfolio} />
          </div>

          <div className="lg:col-span-4 space-y-12">
            <SkillsSection portfolio={portfolio} />
            <div className="sticky top-10">
              <ContactFormSection portfolio={portfolio} project={project} />
            </div>
          </div>
        </div>

        <FooterSection portfolio={portfolio} />
      </div>
    </div>
  );
}
