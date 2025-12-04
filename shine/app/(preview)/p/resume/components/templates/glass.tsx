'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Sparkles,
  Download,
  Send,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Code2,
  User as UserIcon,
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

interface Props {
  project: Project;
  portfolio: Portfolio;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
  themeStyles: ThemeStyles;
}

export function Glass({ project, portfolio, themeMode, onSetThemeMode, themeStyles }: Props) {
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
      toast('Message sent successfully!');
      setIsLoading(false);
      reset();
      return;
    }

    setError(message);
    toast('Something went wrong!');
    setIsLoading(false);
  };

  const socialLinks = [
    { type: 'github', url: portfolio.github, icon: Github },
    { type: 'linkedin', url: portfolio.linkedin, icon: Linkedin },
    { type: 'twitter', url: portfolio.twitter, icon: Twitter },
    { type: 'website', url: portfolio.website, icon: Globe },
  ].filter((link) => link.url);

  // --- Glassmorphism Styling Helpers ---
  // The 'glass' effect relies on semi-transparent backgrounds + backdrop-blur + subtle borders
  const glassPanelClass = `
    backdrop-blur-xl 
    bg-white/40 dark:bg-black/40 
    border border-white/20 dark:border-white/10 
    shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] 
    rounded-2xl
  `;

  const glassInputClass = `
    bg-white/50 dark:bg-black/50 
    border-white/20 dark:border-white/10 
    focus:ring-2 focus:ring-primary/50 
    backdrop-blur-sm 
    placeholder:text-muted-foreground/60
  `;

  return (
    <div className="min-h-screen relative font-sans selection:bg-primary/30 text-foreground overflow-hidden">
      {/* 1. ANIMATED GRADIENT BACKGROUND */}
      <div className="fixed inset-0 -z-10 bg-[#f0f2f5] dark:bg-[#0f0f11]">
        {/* Blob 1 */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-400/30 dark:bg-purple-900/20 blur-[100px] animate-pulse" />
        {/* Blob 2 */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-400/30 dark:bg-blue-900/20 blur-[120px]" />
        {/* Blob 3 */}
        <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full bg-pink-400/20 dark:bg-pink-900/10 blur-[90px] translate-x-[-50%] translate-y-[-50%]" />
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        {/* HEADER SECTION */}
        <header
          className={`${glassPanelClass} p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden group`}
        >
          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none" />

          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-110" />
            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white/50 dark:border-white/10 shadow-xl relative z-10">
              <AvatarImage src={portfolio.user.image_url} className="object-cover" />
              <AvatarFallback className="text-4xl bg-gradient-to-br from-white/80 to-white/40 dark:from-black/80 dark:to-black/40 backdrop-blur-md">
                {portfolio.name?.charAt(0) ?? 'U'}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4 relative z-10">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                {portfolio.name}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3 items-center text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/30 dark:bg-white/5 border border-white/20">
                  <Sparkles className="w-4 h-4 text-yellow-500" /> {portfolio.job_title}
                </span>
                {portfolio.location && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/30 dark:bg-white/5 border border-white/20">
                    <MapPin className="w-4 h-4 text-red-400" /> {portfolio.location}
                  </span>
                )}
              </div>
            </div>

            <p className="text-lg md:text-xl leading-relaxed opacity-90 max-w-2xl">
              {portfolio.introduction}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
              {socialLinks.map((link, i) => (
                <Link key={i} href={link.url!} target="_blank">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300"
                  >
                    <link.icon className="w-5 h-5" />
                  </Button>
                </Link>
              ))}
              <div className="ml-auto">
                <ThemeSwitchToggle isDarkMode={isDarkMode} onSetThemeMode={onSetThemeMode} />
              </div>
            </div>
          </div>
        </header>

        {/* MAIN GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* LEFT COLUMN (Content) - Span 8 */}
          <div className="md:col-span-8 space-y-8">
            {/* About Section */}
            <section className={`${glassPanelClass} p-8`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <UserIcon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">About Me</h2>
              </div>
              <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                {portfolio.about}
              </div>
            </section>

            {/* Experience Section */}
            <section>
              <div className="flex items-center gap-3 mb-6 px-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Experience</h2>
              </div>

              <div className="space-y-4">
                {portfolio.work_experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className={`${glassPanelClass} p-6 transition-all duration-300 hover:bg-white/60 dark:hover:bg-black/60 group`}
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-2 mb-3">
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {exp.role}
                        </h3>
                        <p className="font-medium opacity-80">{exp.company}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-white/20 dark:bg-white/10 backdrop-blur-md self-start"
                      >
                        {exp.start_date} - {exp.end_date}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{exp.about}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs opacity-60">
                      <MapPin className="w-3 h-3" /> {exp.location}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects Section */}
            <section>
              <div className="flex items-center gap-3 mb-6 px-2">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                  <Code2 className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Featured Projects</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {portfolio.showcases.map((showcase) => (
                  <Link
                    key={showcase.id}
                    href={showcase.url}
                    target="_blank"
                    className="block group"
                  >
                    <div
                      className={`${glassPanelClass} p-0 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold flex items-center gap-2">
                            {showcase.name}
                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {showcase.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {showcase.technologies.map((tech) => (
                            <span
                              key={tech.id}
                              className="text-xs font-medium px-2 py-1 rounded-md bg-primary/5 text-primary border border-primary/10"
                            >
                              {tech.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="h-1 w-full bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN (Sidebar) - Span 4 */}
          <div className="md:col-span-4 space-y-8">
            {/* Contact Card */}
            <div className={`${glassPanelClass} p-6 sticky top-8`}>
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg mb-3">
                  <Send className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">Get in Touch</h3>
                <p className="text-sm text-muted-foreground">Have a project? Let's talk.</p>
              </div>

              {error && (
                <Alert
                  variant="destructive"
                  className="mb-4 bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold opacity-70">Name</Label>
                  <Input {...register('name')} className={glassInputClass} placeholder="Jane Doe" />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold opacity-70">Email</Label>
                  <Input
                    {...register('email')}
                    type="email"
                    className={glassInputClass}
                    placeholder="jane@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold opacity-70">Contact #</Label>
                  <Input
                    {...register('contact_number')}
                    className={glassInputClass}
                    placeholder="+1 234..."
                  />
                  {errors.contact_number && (
                    <p className="text-xs text-red-500">{errors.contact_number.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold opacity-70">Message</Label>
                  <Textarea
                    {...register('message')}
                    className={`${glassInputClass} min-h-[100px] resize-none`}
                    placeholder="Hello..."
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
                >
                  {isLoading ? 'Sending...' : 'Send Message'}
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                {portfolio.email && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <Mail className="w-4 h-4" /> {portfolio.email}
                  </div>
                )}
                {portfolio.phone && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <Phone className="w-4 h-4" /> {portfolio.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Education & Skills */}
            <div className={`${glassPanelClass} p-6`}>
              <div className="flex items-center gap-2 mb-4 text-lg font-bold">
                <GraduationCap className="w-5 h-5 text-primary" /> Education
              </div>
              <div className="space-y-4 mb-8">
                {portfolio.education.map((edu) => (
                  <div key={edu.id} className="relative pl-4 border-l-2 border-primary/30">
                    <div className="font-bold text-sm">{edu.school}</div>
                    <div className="text-xs text-muted-foreground">{edu.degree}</div>
                    <div className="text-[10px] opacity-60 mt-1">
                      {edu.year_start} - {edu.year_end}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-4 text-lg font-bold border-t border-white/10 pt-6">
                <Sparkles className="w-5 h-5 text-primary" /> Skills
              </div>
              <div className="flex flex-wrap gap-1.5">
                {portfolio.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="text-xs px-2 py-1 rounded-md bg-white/30 dark:bg-white/5 border border-white/10"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center py-8 text-sm text-muted-foreground">
          <p className="opacity-60">
            © {new Date().getFullYear()} {portfolio.name}. Designed with Glassmorphism.
          </p>
        </footer>
      </div>
    </div>
  );
}
