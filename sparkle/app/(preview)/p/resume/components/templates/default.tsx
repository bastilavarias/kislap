'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Github,
  Linkedin,
  Twitter,
  Globe,
  ArrowUpRight,
  Mail,
  Loader2,
  CalendarDays,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Mode } from '@/contexts/settings-context';
import { useMemo, useState } from 'react';
import { ThemeSwitchToggle } from '@/app/(preview)/p/resume/components/templates/components/theme-switch-toggle';
import Link from 'next/link';
import { ThemeStyles } from '@/types/theme';
import { AppointmentFormValues, AppointmentSchema } from '@/lib/schemas/appointment';
import { CreateAppointmentPayload, useAppointment } from '@/hooks/api/use-appointment';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Project } from '@/types/project';
import { Portfolio } from '@/types/portfolio';
import { cn } from '@/lib/utils';

interface Props {
  project: Project;
  portfolio: Portfolio;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
  themeStyles: ThemeStyles;
}

export function Default({ project, portfolio, themeMode, onSetThemeMode, themeStyles }: Props) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isDarkMode = useMemo(() => themeMode === 'dark', [themeMode]);

  const { create } = useAppointment();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      name: '',
      contact_number: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (form: AppointmentFormValues) => {
    setError('');
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
      toast.success('Message sent successfully.');
      setIsLoading(false);
      reset();
      return;
    }

    setError(message);
    toast.error('Failed to send message.');
    setIsLoading(false);
  };

  const socialLinks = [
    { type: 'github', url: portfolio.github, icon: Github },
    { type: 'linkedin', url: portfolio.linkedin, icon: Linkedin },
    { type: 'twitter', url: portfolio.twitter, icon: Twitter },
    { type: 'website', url: portfolio.website, icon: Globe },
  ].filter((link) => link.url);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 selection:text-primary font-sans">
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-20">
        {/* HEADER SECTION */}
        <header className="space-y-8">
          <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-8">
            <div className="space-y-4 flex-1">
              <div className="space-y-1">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                  {portfolio.name}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                  {portfolio.job_title}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {portfolio.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{portfolio.location}</span>
                  </div>
                )}
                {portfolio.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    <span>{portfolio.email}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                {socialLinks.map((link, i) => (
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
            </div>

            <div className="flex flex-col items-end gap-4">
              <ThemeSwitchToggle isDarkMode={isDarkMode} onSetThemeMode={onSetThemeMode} />
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border bg-muted">
                <AvatarImage src={portfolio.user.image_url} className="object-cover" />
                <AvatarFallback className="text-2xl text-muted-foreground">
                  {portfolio.name?.charAt(0) ?? 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="max-w-3xl">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {portfolio.about || portfolio.introduction}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t pt-12">
          {/* LEFT COLUMN: Main Content (Span 8) */}
          <div className="lg:col-span-8 space-y-16">
            {/* WORK EXPERIENCE */}
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
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                        {exp.role}
                      </h3>
                      <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">
                        {exp.start_date} — {exp.end_date}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3 font-medium">
                      {exp.company} • {exp.location}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{exp.about}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* PROJECTS */}
            <section className="space-y-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolio.showcases.map((project) => (
                  <Link
                    key={project.id}
                    href={project.url}
                    target="_blank"
                    className="group block h-full"
                  >
                    <div className="h-full rounded-lg border bg-card p-6 transition-all hover:shadow-md hover:border-primary/20">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                          {project.name}
                        </h3>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {project.description}
                      </p>
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
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* EDUCATION */}
            <section className="space-y-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Education
              </h2>
              <div className="space-y-4">
                {portfolio.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-border/40 last:border-0"
                  >
                    <div>
                      <div className="font-medium text-foreground">{edu.school}</div>
                      <div className="text-sm text-muted-foreground">{edu.degree}</div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 sm:mt-0 font-medium">
                      {edu.year_start} - {edu.year_end}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Sidebar (Span 4) */}
          <div className="lg:col-span-4 space-y-12">
            {/* SKILLS */}
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

            {/* CONTACT FORM */}
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
                    {...register('name')}
                    id="name"
                    className="bg-background border-border/60 focus-visible:ring-offset-0"
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-medium">
                    Email
                  </Label>
                  <Input
                    {...register('email')}
                    id="email"
                    type="email"
                    className="bg-background border-border/60 focus-visible:ring-offset-0"
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="contact" className="text-xs font-medium">
                    Phone (Optional)
                  </Label>
                  <Input
                    {...register('contact_number')}
                    id="contact"
                    className="bg-background border-border/60 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="message" className="text-xs font-medium">
                    Message
                  </Label>
                  <Textarea
                    {...register('message')}
                    id="message"
                    className="bg-background border-border/60 min-h-[100px] resize-none focus-visible:ring-offset-0"
                    placeholder="How can I help you?"
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive mt-1">{errors.message.message}</p>
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
          </div>
        </div>

        <footer className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {portfolio.name}. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
