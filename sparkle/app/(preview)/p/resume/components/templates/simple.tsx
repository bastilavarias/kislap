'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Globe, MapPin, Calendar, ChevronRight, AlertCircleIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Mode } from '@/contexts/settings-context';
import { useMemo, useState } from 'react';
import { ThemeSwitchToggle } from '@/app/(preview)/p/resume/components/templates/components/theme-switch-toggle';
import Link from 'next/link';
import { AppointmentDialog } from '@/app/(preview)/p/resume/components/templates/components/appointment-dialog';
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

export function Simple({ portfolio, themeMode, onSetThemeMode, themeStyles }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isDarkMode = useMemo(() => themeMode === 'dark', [themeMode]);

  const { create } = useAppointment();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
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
      user_id: 1,
      project_id: 1,
      date: '',
      time_from: '',
      time_to: '',
      name: form.name,
      email: form.email,
      contact_number: form.contact_number,
      message: form.message,
    };

    const { success, data, message } = await create(payload);

    if (success && data) {
      toast('Portfolio succesfully details saved.');
      setIsLoading(false);
      return;
    }

    setError(message);
    toast('Something went wrong!');
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 py-6 text-foreground">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <Avatar className="w-28 h-28 object-cover">
                <AvatarImage src="https://yt3.googleusercontent.com/DUK0KCuswoaUwvZZhqAgW4e-tdOKkfguzPAHTjdRzD1KBuqV2SJm8vtpzRJ-_vXljUXnalMvs7M=s160-c-k-c0x00ffffff-no-rj" />
                <AvatarFallback className="text-2xl">
                  {portfolio.name?.charAt(0) ?? 'U'}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{portfolio.name}</h1>
                  {portfolio.job_title && (
                    <p className="text-lg">
                      <span className="font-semibold">{portfolio.job_title}</span>
                    </p>
                  )}
                </div>
                <ThemeSwitchToggle isDarkMode={isDarkMode} onSetThemeMode={onSetThemeMode} />
              </div>

              {portfolio.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{portfolio.location}</span>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {/*
                <div className="flex justify-between">
                  <div className="flex-1" />
                  <Button onClick={() => setIsDialogOpen(!isDialogOpen)}>
                    <Calendar />
                    Schedule a Meeting
                    <ChevronRight />
                  </Button>
                </div>
                */}

                <Card>
                  <CardContent className="flex justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium">{portfolio.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium">{portfolio.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Website</p>
                        <p className="font-medium">{portfolio.website}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <section>
            <div className="font-bold mb-4 flex items-center text-xl">About Me</div>
            <div className="space-y-4 leading-relaxed">
              <p>{portfolio.introduction}</p>
              <p>{portfolio.about}</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">⚙️</span> Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill) => (
                <Badge key={skill.id} className="bg-primary text-md">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <span className="text-2xl">📁</span> Recent Projects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.showcases.map((showcase) => (
                <Card key={showcase.id} className="border border-border">
                  <CardHeader>
                    <CardTitle className={cn('font-bold', '')}>{showcase.name}</CardTitle>
                    <CardDescription>
                      <Link
                        href={showcase.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        {showcase.url.replace(/^https?:\/\/(www\.)?/, '')}
                      </Link>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col space-y-4">
                    <p className="text-muted-foreground">{showcase.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {showcase.technologies.map((tech) => (
                        <Badge key={tech.id} variant="secondary" className="text-xs">
                          {tech.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🤝</span> Get in Touch
            </h2>

            <div className="flex flex-col justify-between space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertTitle className="capitalize">{error}</AlertTitle>
                </Alert>
              )}

              <Card>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-medium mb-2">Name</Label>
                    <Input
                      {...register('name')}
                      placeholder="Juan Dela Cruz"
                      className="w-full shadow-none"
                      required
                    />
                    {errors.name && (
                      <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label className="font-medium mb-2">Email</Label>
                    <Input
                      {...register('email')}
                      placeholder="you@example.com"
                      className="w-full shadow-none"
                      type="email"
                      required
                    />
                    {errors.email && (
                      <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label className="font-medium mb-2">Contact Number</Label>
                    <Input
                      {...register('contact_number')}
                      placeholder="09965594483"
                      className="w-full shadow-none"
                      type="tel"
                    />
                    {errors.contact_number && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.contact_number.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="font-medium mb-2">Message</Label>
                    <Textarea
                      {...register('message')}
                      placeholder="Tell us more about your message..."
                      className="w-full shadow-none"
                    />
                    {errors.message && (
                      <p className="text-destructive text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <div className="flex-1" />
                  <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
                    Send
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">💼</span> Experience
            </h2>
            <div className="space-y-4">
              {portfolio.work_experiences.map((exp) => (
                <div key={exp.id} className="pb-4 border-b border-border last:border-0 space-y-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold">{exp.company}</p>
                      <span className="text-xs whitespace-nowrap">
                        {exp.start_date} - {exp.end_date}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-sm">{exp.role}</p>
                      <Badge variant="secondary" className="text-xs rounded-2xl">
                        {exp.location}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs">{exp.about}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🎒</span> Education
            </h2>
            <div className="space-y-4">
              {portfolio.education.map((education) => (
                <div
                  key={education.id}
                  className="pb-4 border-b border-border last:border-b-0 space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{education.school}</p>
                      <p className="text-sm">{education.degree} </p>
                      {education.location ?? <p>{education.location}</p>}
                      <div className="flex space-x-1"></div>
                    </div>
                    <span className="text-xs whitespace-nowrap">
                      {education.year_start} - {education.year_end}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <AppointmentDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        themeMode={themeMode}
        themeStyles={themeStyles}
      />
    </div>
  );
}
