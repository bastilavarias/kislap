'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Portfolio {
  id: number;
  name: string;
  job_title: string | null;
  introduction: string;
  about: string;
  email: string;
  phone: string;
  website: string;
  github: string;
  linkedin?: string;
  twitter?: string;
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
    technologies: { id: number; name: string }[];
  }[];
  skills: { id: number; name: string }[];
}

export function Default2({ portfolio }: { portfolio: Portfolio }) {
  return (
    <div className="flex flex-col gap-6 py-6">
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
                  <h1 className="text-3xl font-bold text-foreground">{portfolio.name}</h1>
                  <p className="text-md text-foreground">
                    <span className="font-semibold">{portfolio.job_title}</span>
                  </p>
                </div>
                <div className="w-12 h-6 bg-muted rounded-full"></div>
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                <span>Metro Manila, Philippines</span>
              </div>

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
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <section>
            <div className="font-bold text-foreground mb-4 flex items-center text-xl">About Me</div>
            <div className="space-y-4 text-foreground leading-relaxed">
              <p>{portfolio.introduction}</p>
              <p>{portfolio.about}</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
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
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
              <span className="text-2xl">📁</span> Recent Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.showcases.map((showcase) => (
                <Card key={showcase.id} className="border border-border">
                  <CardHeader>
                    <CardTitle className={cn('font-bold text-foreground', '')}>
                      {showcase.name}
                    </CardTitle>
                    <CardDescription className="cursor-pointer hover:underline">
                      project-url.app
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
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-2xl">💼</span> Experience
            </h2>
            <div className="space-y-4">
              {portfolio.work_experiences.map((exp) => (
                <div key={exp.id} className="pb-4 border-b border-border last:border-0 space-y-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-foreground">{exp.company}</p>
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
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
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
                      <p className="font-semibold text-foreground">{education.school}</p>
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
    </div>
  );
}
