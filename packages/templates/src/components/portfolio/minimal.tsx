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
  ArrowRight,
  Terminal,
  Code,
  Briefcase,
  GraduationCap,
  Send,
  AlertCircleIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

interface Props {
  portfolio: Portfolio;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
  themeStyles: ThemeStyles;
}

interface Portfolio {
  id: number;
  name: string;
  location: string | null;
  job_title: string | null;
  introduction: string | null;
  about: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;

  work_experiences: {
    id: number;
    company: string;
    role: string;
    location: string;
    start_date: string;
    end_date: string;
    about: string;
  }[];
  education: {
    id: number;
    school: string;
    level: string;
    degree: string;
    location: string;
    about: string;
    year_start: string;
    year_end: string;
  }[];
  showcases: {
    id: number;
    name: string;
    description: string;
    role: string;
    url: string;
    technologies: { id: number; name: string }[];
  }[];
  skills: { id: number; name: string }[];
}

export function Minimal({
  portfolio,
  themeMode,
  onSetThemeMode,
  themeStyles,
}: Props) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isDarkMode = useMemo(() => themeMode === "dark", [themeMode]);

  const { create } = useAppointment();

  const {
    register,
    handleSubmit,
    formState: { errors },
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
    setError("");
    setIsLoading(true);

    const payload: CreateAppointmentPayload = {
      user_id: 1,
      project_id: 1,
      date: "",
      time_from: "",
      time_to: "",
      name: form.name,
      email: form.email,
      contact_number: form.contact_number,
      message: form.message,
    };

    // Placeholder for API call
    // const { success, data, message } = await create(payload);

    // Simulate success
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const success = true;

    if (success) {
      toast("Message sent successfully!");
      setIsLoading(false);
      return;
    }

    // setError(message);
    toast("Something went wrong!");
    setIsLoading(false);
  };

  const socialLinks = [
    { type: "github", url: portfolio.github, icon: Github },
    { type: "linkedin", url: portfolio.linkedin, icon: Linkedin },
    { type: "twitter", url: portfolio.twitter, icon: Twitter },
    { type: "website", url: portfolio.website, icon: Globe },
  ].filter((link) => link.url);

  // Minimalist Styles Helper
  const minimalistHeaderClass =
    "border-b border-primary/20 pb-2 mb-4 font-bold text-lg uppercase tracking-wider text-primary";

  const minimalistCardClass =
    "border-none shadow-none rounded-lg bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg";

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row gap-8 items-center justify-between border-b border-foreground/10 pb-10">
          <div className="flex gap-6 items-center w-full">
            <div className="relative">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-primary/20 bg-muted/50 rounded-full shadow-lg">
                <AvatarImage src="https://placehold.co/300x300/e0f2fe/0369a1?text=A.D." />
                <AvatarFallback className="text-4xl font-bold rounded-full bg-primary text-primary-foreground">
                  {portfolio.name?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-1 flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                {portfolio.name}
              </h1>
              <div className="flex flex-col md:flex-row gap-2 md:items-center text-xl font-medium text-muted-foreground">
                <span className="flex items-center gap-2 text-primary">
                  <Terminal className="w-5 h-5" /> {portfolio.job_title}
                </span>
                {portfolio.location && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {portfolio.location}
                  </span>
                )}
              </div>
              <p className="mt-4 text-sm text-foreground/70">
                {portfolio.introduction}
              </p>
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-12">
          {/* MAIN CONTENT COLUMN (8/12) */}
          <div className="md:w-8/12 space-y-10">
            {/* ABOUT ME / DETAILED INTRODUCTION */}
            <section className="border-l-4 border-primary/50 pl-6">
              <h2 className={minimalistHeaderClass}>About Me</h2>
              <p className="text-base leading-relaxed text-foreground/80">
                {portfolio.about}
              </p>
            </section>

            {/* WORK EXPERIENCE */}
            <section>
              <h2
                className={minimalistHeaderClass + " flex items-center gap-2"}
              >
                <Briefcase className="w-5 h-5" /> Experience
              </h2>
              <div className="space-y-8">
                {portfolio.work_experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="relative pl-8 border-l border-foreground/20 group"
                  >
                    <span className="absolute left-[-6px] top-0 w-3 h-3 bg-primary rounded-full group-hover:scale-125 transition-transform duration-200" />
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold">{exp.role}</h3>
                        <div className="font-medium text-muted-foreground">
                          {exp.company}, {exp.location}
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs opacity-80 whitespace-nowrap"
                      >
                        {exp.start_date} - {exp.end_date}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground/70">{exp.about}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* PROJECTS SECTION */}
            <section>
              <h2
                className={minimalistHeaderClass + " flex items-center gap-2"}
              >
                <Code className="w-5 h-5" /> Projects
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {portfolio.showcases.map((project) => (
                  <Link
                    key={project.id}
                    href={project.url}
                    target="_blank"
                    className="group block"
                  >
                    <Card
                      className={minimalistCardClass + " border border-border"}
                    >
                      <CardHeader className="p-4 border-b border-border/50">
                        <CardTitle className="text-lg font-bold flex justify-between items-center">
                          {project.name}
                          <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <p className="text-sm text-foreground/70">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {project.technologies.map((t) => (
                            <Badge
                              key={t.id}
                              variant="outline"
                              className="text-xs font-normal bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                            >
                              {t.name}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* SIDEBAR COLUMN (4/12) */}
          <div className="md:w-4/12 space-y-10">
            {/* CONTACT & SOCIALS */}
            <Card className={minimalistCardClass}>
              <CardHeader className="p-4 border-b border-border/50">
                <CardTitle className="text-lg font-bold">Connect</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-sm">
                <div className="space-y-3">
                  {portfolio.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-primary" />
                      <a
                        href={`mailto:${portfolio.email}`}
                        className="hover:text-primary transition-colors"
                      >
                        {portfolio.email}
                      </a>
                    </div>
                  )}
                  {portfolio.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-primary" />
                      <a
                        href={`tel:${portfolio.phone}`}
                        className="hover:text-primary transition-colors"
                      >
                        {portfolio.phone}
                      </a>
                    </div>
                  )}
                  {socialLinks.map((link, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <link.icon className="w-4 h-4 text-primary" />
                      <Link
                        href={link.url!}
                        target="_blank"
                        className="hover:text-primary transition-colors"
                      >
                        {link.type.charAt(0).toUpperCase() + link.type.slice(1)}{" "}
                        Profile
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-border/50 flex justify-center">
                  <ThemeSwitchToggle
                    isDarkMode={isDarkMode}
                    onSetThemeMode={onSetThemeMode}
                  />
                </div>
              </CardContent>
            </Card>

            {/* SKILLS BOX */}
            <Card className={minimalistCardClass}>
              <CardHeader className="p-4 border-b border-border/50">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Code className="w-5 h-5" /> Skills/Stack
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex flex-wrap gap-2">
                {portfolio.skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="default"
                    className="text-xs font-semibold bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            {/* EDUCATION */}
            <section>
              <h2
                className={minimalistHeaderClass + " flex items-center gap-2"}
              >
                <GraduationCap className="w-5 h-5" /> Education
              </h2>
              <div className="space-y-4">
                {portfolio.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-4 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{edu.school}</div>
                        <div className="text-sm text-muted-foreground">
                          {edu.degree}
                        </div>
                      </div>
                      <div className="text-xs font-medium text-right text-primary">
                        {edu.year_start}-{edu.year_end}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* CONTACT FORM */}
        <section className="py-12 border-t border-foreground/10 mt-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Get in Touch</h2>
          <Card
            className={minimalistCardClass + " max-w-3xl mx-auto p-6 md:p-8"}
          >
            {error && (
              <Alert
                variant="destructive"
                className="mb-6 rounded-lg bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100"
              >
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle className="font-semibold">{error}</AlertTitle>
              </Alert>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-semibold">Name *</Label>
                  <Input
                    {...register("name")}
                    placeholder="Your Name"
                    className="rounded-lg border-border focus:border-primary transition-colors"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Email *</Label>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="you@email.com"
                    className="rounded-lg border-border focus:border-primary transition-colors"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Contact No.</Label>
                  <Input
                    {...register("contact_number")}
                    placeholder="+1 555 123 4567"
                    className="rounded-lg border-border focus:border-primary transition-colors"
                  />
                  {errors.contact_number && (
                    <p className="text-red-500 text-xs">
                      {errors.contact_number.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-4 flex flex-col">
                <div className="space-y-2 flex-1 flex flex-col">
                  <Label className="font-semibold">Message</Label>
                  <Textarea
                    {...register("message")}
                    placeholder="I'd love to chat about..."
                    className="flex-1 min-h-[150px] resize-none rounded-lg border-border focus:border-primary transition-colors"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs">
                      {errors.message.message}
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isLoading}
                  className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold"
                >
                  {isLoading ? "Sending..." : "Send Message"}{" "}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </section>

        <footer className="text-center text-sm pt-8 text-muted-foreground">
          Built with a Minimalist approach. © {new Date().getFullYear()}{" "}
          {portfolio.name}.
        </footer>
      </div>
    </div>
  );
}
