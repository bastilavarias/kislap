"use client";

import { useMemo, useState } from "react";
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
  Briefcase,
  GraduationCap,
  Send,
  AlertCircleIcon,
  ArrowUpRight,
  Loader2,
  Facebook,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

interface Props {
  project: Project;
  portfolio: Portfolio;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
  themeStyles: ThemeStyles;
}

interface SectionProps {
  portfolio: Portfolio;
  className?: string;
  style?: React.CSSProperties;
}

const HeroCard = ({ portfolio, className, style }: SectionProps) => {
  return (
    <Card
      className={cn(
        "flex flex-col justify-between overflow-hidden border-0 relative group shadow-sm hover:shadow-xl transition-all duration-500 animate-in fade-in zoom-in-95",
        className
      )}
      style={style}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

      <CardHeader className="relative z-10">
        <div className="flex justify-between items-start">
          {portfolio.user?.image_url && (
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-2xl ring-2 ring-primary/10 group-hover:scale-105 transition-transform duration-300">
              <AvatarImage
                src={portfolio.user.image_url}
                className="object-cover"
              />
              <AvatarFallback className="text-4xl font-black bg-muted text-muted-foreground">
                {portfolio.name?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
          )}
          {portfolio.location && (
            <Badge
              variant="secondary"
              className="text-xs py-1.5 px-3 gap-1.5 backdrop-blur shadow-sm"
            >
              <MapPin className="w-3 h-3" />
              {portfolio.location}
            </Badge>
          )}
        </div>
        <div className="space-y-2 mt-6">
          <CardTitle className="text-4xl md:text-6xl font-black tracking-tight leading-[0.9]">
            {portfolio.name || "Untitled Portfolio"}
          </CardTitle>
          {portfolio.job_title && (
            <CardDescription className="text-xl md:text-2xl font-medium text-primary">
              {portfolio.job_title}
            </CardDescription>
          )}
        </div>
      </CardHeader>
      {(portfolio.introduction || portfolio.about) && (
        <CardContent className="relative z-10">
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg max-w-lg">
            {portfolio.introduction || portfolio.about}
          </p>
        </CardContent>
      )}
    </Card>
  );
};

const ContactInfoCard = ({ portfolio, className, style }: SectionProps) => {
  return (
    <Card
      className={cn(
        "bg-primary text-primary-foreground border-none shadow-lg animate-in fade-in slide-in-from-bottom-4",
        className
      )}
      style={style}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mail className="h-5 w-5 opacity-80" /> Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 text-sm font-medium">
        {portfolio.email && (
          <div
            className="flex flex-col gap-1 group cursor-pointer"
            onClick={() => window.open(`mailto:${portfolio.email}`)}
          >
            <span className="opacity-70 text-xs uppercase tracking-wider">
              Email
            </span>
            <span className="truncate text-base group-hover:underline decoration-white/50 underline-offset-4">
              {portfolio.email}
            </span>
          </div>
        )}
        {portfolio.phone && (
          <div className="flex flex-col gap-1">
            <span className="opacity-70 text-xs uppercase tracking-wider">
              Phone
            </span>
            <span className="truncate text-base">{portfolio.phone}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SocialsCard = ({ portfolio, className, style }: SectionProps) => {
  const socialLinks = useMemo(() => {
    return [
      { type: "github", url: portfolio.github, icon: Github },
      { type: "linkedin", url: portfolio.linkedin, icon: Linkedin },
      { type: "twitter", url: portfolio.twitter, icon: Twitter },
      { type: "website", url: portfolio.website, icon: Globe },
    ].filter((link) => link.url);
  }, [portfolio]);

  if (socialLinks.length === 0) return null;

  return (
    <Card
      className={cn(
        "flex flex-col justify-center items-center gap-6 p-6 animate-in fade-in slide-in-from-bottom-4 border-dashed border-2 hover:border-solid hover:border-primary/50 transition-all duration-300",
        className
      )}
      style={style}
    >
      <div className="text-center font-bold text-muted-foreground text-xs uppercase tracking-widest">
        Connect
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        {socialLinks.map((social, idx) => (
          <Link key={idx} href={social.url!} target="_blank">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:-rotate-6 transition-all duration-300 shadow-sm"
            >
              <social.icon className="h-5 w-5" />
            </Button>
          </Link>
        ))}
      </div>
    </Card>
  );
};

const AboutCard = ({ portfolio, className, style }: SectionProps) => {
  if (!portfolio.about) return null;

  return (
    <Card
      className={cn(
        "border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-muted/20 animate-in fade-in slide-in-from-bottom-4",
        className
      )}
      style={style}
    >
      <CardHeader>
        <CardTitle className="text-lg uppercase tracking-widest text-muted-foreground font-bold">
          About Me
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/80 leading-relaxed text-lg">
          {portfolio.about}
        </p>
      </CardContent>
    </Card>
  );
};

const SkillsCard = ({ portfolio, className, style }: SectionProps) => {
  if (!portfolio.skills || portfolio.skills.length === 0) return null;

  return (
    <Card
      className={cn(
        "border-0 shadow-sm animate-in fade-in slide-in-from-bottom-4",
        className
      )}
      style={style}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">⚡ Tech Stack</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {portfolio.skills.map((skill, i) => (
            <Badge
              key={skill.id}
              variant="secondary"
              className="px-4 py-2 text-sm border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-default animate-in zoom-in duration-300"
              style={{ animationDelay: `${300 + i * 50}ms` }}
            >
              {skill.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectsSection = ({
  portfolio,
  projectId,
  className,
  style,
}: SectionProps & { projectId: number }) => {
  const { trackPageProjectClick } = usePageActivity();

  if (!portfolio?.showcases || portfolio.showcases.length === 0) return null;

  const handleTrackClick = (modelID: number) => {
    trackPageProjectClick(projectId, modelID);
  };

  return (
    <div className={className} style={style}>
      <div className="py-6 animate-in fade-in">
        <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
          Selected Work{" "}
          <ArrowUpRight className="w-6 h-6 text-muted-foreground" />
        </h2>
      </div>
      {portfolio.showcases.map((showcase, i) => (
        <Card
          key={showcase.id}
          className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-8 mb-4 last:mb-0"
          style={{ animationDelay: `${400 + i * 100}ms` }}
        >
          {showcase.url && (
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300 z-20 pointer-events-none">
              <ExternalLink className="h-6 w-6 text-primary bg-background rounded-full p-1 shadow-sm" />
            </div>
          )}

          <CardHeader>
            <CardTitle className="text-xl font-bold truncate pr-6 group-hover:text-primary transition-colors">
              {showcase.name}
            </CardTitle>
            {showcase.description && (
              <CardDescription className="line-clamp-2 mt-2">
                {showcase.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {showcase.technologies && showcase.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {showcase.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech.id}
                    className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/80 bg-muted px-2 py-1 rounded-md"
                  >
                    {tech.name}
                  </span>
                ))}
                {showcase.technologies.length > 4 && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/80 bg-muted px-2 py-1 rounded-md">
                    +{showcase.technologies.length - 4}
                  </span>
                )}
              </div>
            )}
          </CardContent>
          {showcase.url && (
            <Link
              href={showcase.url}
              target="_blank"
              className="absolute inset-0 z-10"
              onClick={() => handleTrackClick(showcase.id)}
            />
          )}
        </Card>
      ))}
    </div>
  );
};

const ExperienceEducationSection = ({
  portfolio,
  className,
  style,
}: SectionProps) => {
  return (
    <div className={className} style={style}>
      {/* Experience */}
      {portfolio.work_experiences && portfolio.work_experiences.length > 0 && (
        <Card className="border-none shadow-none bg-muted/30 animate-in fade-in slide-in-from-left-4 h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Briefcase className="w-5 h-5 text-primary" /> Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {portfolio.work_experiences.map((exp) => (
              <div
                key={exp.id}
                className="relative pl-6 border-l-2 border-primary/20 hover:border-primary transition-colors group"
              >
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{exp.company}</span>
                  <span className="text-primary font-medium text-sm">
                    {exp.role}
                  </span>
                  <span className="text-xs text-muted-foreground mb-2 font-mono mt-1">
                    {exp.start_date || "N/A"} — {exp.end_date || "Present"}
                  </span>
                  {exp.about && (
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {exp.about}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {portfolio.education && portfolio.education.length > 0 && (
        <Card className="border-none shadow-none bg-muted/30 animate-in fade-in slide-in-from-right-4 h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <GraduationCap className="w-5 h-5 text-primary" /> Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {portfolio.education.map((edu) => (
              <div
                key={edu.id}
                className="relative pl-6 border-l-2 border-primary/20 hover:border-primary transition-colors group"
              >
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{edu.school}</span>
                  {edu.degree && (
                    <span className="text-primary font-medium text-sm">
                      {edu.degree}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground mb-2 font-mono mt-1">
                    {edu.year_start || "N/A"} — {edu.year_end || "Present"}
                  </span>
                  {edu.location && (
                    <p className="text-sm text-muted-foreground">
                      {edu.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const ContactFormSection = ({
  portfolio,
  project,
  className,
  style,
}: SectionProps & { project: Project }) => {
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
      toast.success("Message sent successfully!");
      setIsLoading(false);
      reset();
      return;
    }

    setError(message || "Failed to send message");
    toast.error("Failed to send message.");
    setIsLoading(false);
  };

  return (
    <Card
      className={cn(
        "border-0 shadow-xl overflow-hidden ring-1 ring-border/50",
        className
      )}
      style={style}
    >
      <div className="grid md:grid-cols-5 h-full">
        {/* Decorative Side Panel */}
        <div className="md:col-span-2 bg-primary text-primary-foreground p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
          <h3 className="text-3xl md:text-4xl font-black mb-6 uppercase tracking-tight relative z-10">
            Let's Work Together
          </h3>
          <p className="opacity-90 text-lg relative z-10 leading-relaxed">
            Have a project in mind? Fill out the form and I'll get back to you
            as soon as possible.
          </p>
          <div className="mt-12 space-y-3 opacity-80 text-sm font-mono relative z-10">
            {portfolio.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" /> {portfolio.email}
              </div>
            )}
            {portfolio.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" /> {portfolio.phone}
              </div>
            )}
          </div>
        </div>

        {/* Form Area */}
        <div className="md:col-span-3 p-6 md:p-12 bg-card">
          {error && (
            <Alert
              variant="destructive"
              className="mb-6 animate-in slide-in-from-top-2"
            >
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  {...register("name")}
                  placeholder="John Doe"
                  className="bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary shadow-inner"
                />
                {errors.name && (
                  <p className="text-destructive text-xs">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Contact No.</Label>
                <Input
                  {...register("contact_number")}
                  placeholder="+1 234..."
                  className="bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary shadow-inner"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="john@example.com"
                className="bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary shadow-inner"
              />
              {errors.email && (
                <p className="text-destructive text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                {...register("message")}
                placeholder="Tell me about your project..."
                className="min-h-[120px] bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary shadow-inner resize-none"
              />
              {errors.message && (
                <p className="text-destructive text-xs">
                  {errors.message.message}
                </p>
              )}
            </div>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="w-full md:w-auto font-bold h-12 px-8 shadow-lg hover:shadow-primary/25 transition-all"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Send Message{" "}
                  <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
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
    <footer className="border-t py-12 mt-20 bg-muted/5">
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

// --- Main Component ---

export function Bento({
  project,
  portfolio,
  themeMode,
  onSetThemeMode,
}: Props) {
  const isDarkMode = useMemo(() => themeMode === "dark", [themeMode]);

  const delay = (ms: number) => ({
    animationDelay: `${ms}ms`,
    animationFillMode: "both" as const,
  });

  if (!portfolio) return null;

  console.log("im used");

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4 fade-in slide-in-from-top-4 duration-700 animate-in">
          <div className="flex-1" />
          <ThemeSwitchToggle
            isDarkMode={isDarkMode}
            onSetThemeMode={onSetThemeMode}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
          <HeroCard
            portfolio={portfolio}
            className="md:col-span-2 md:row-span-2"
            style={delay(0)}
          />

          <ContactInfoCard
            portfolio={portfolio}
            className="md:col-span-1"
            style={delay(100)}
          />

          <SocialsCard
            portfolio={portfolio}
            className="md:col-span-1"
            style={delay(150)}
          />

          <AboutCard
            portfolio={portfolio}
            className="md:col-span-2 lg:col-span-2"
            style={delay(200)}
          />

          <SkillsCard
            portfolio={portfolio}
            className="col-span-4 md:col-span-4"
            style={delay(250)}
          />

          <ProjectsSection
            portfolio={portfolio}
            projectId={project.id}
            className="md:col-span-3 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            style={delay(300)}
          />

          <ExperienceEducationSection
            portfolio={portfolio}
            className="md:col-span-3 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
            style={delay(600)}
          />

          <ContactFormSection
            portfolio={portfolio}
            project={project}
            className="md:col-span-3 lg:col-span-4 mt-8 animate-in fade-in zoom-in-95"
            style={delay(800)}
          />
        </div>

        <FooterSection portfolio={portfolio} />
      </div>
    </div>
  );
}
