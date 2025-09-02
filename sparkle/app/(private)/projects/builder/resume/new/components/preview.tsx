'use client';
import { PreviewWrapper } from '@/components/preview-wrapper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Mail, Phone, Github } from 'lucide-react';
import { Mode } from '@/contexts/settingsContext';

export function Preview() {
  const resumeData = {
    name: 'Sebastian Curtis Lavarias',
    title:
      'Experienced Full-stack Web Developer with a strong background in PHP, JavaScript, and modern web technologies. Skilled in developing and maintaining scalable web applications and platforms. Passionate about leveraging technology to solve real-world problems and enhance user experiences.',
    location: 'Philippines',
    email: 'sebastian@email.com',
    phone: '+63 123 456 7890',
    website: 'sebastian-dev.com',
    github: 'github.com/sebastian',
    about:
      'Experienced Full-stack Web Developer with a strong background in PHP, JavaScript, and modern web technologies. Skilled in developing and maintaining scalable web applications and platforms. Passionate about leveraging technology to solve real-world problems and enhance user experiences.',
    workExperience: [
      {
        jobTitle: 'Full-stack Web Developer',
        company: 'Chanzit • Full-Time',
        location: 'Philippines',
        startDate: 'Oct 2022',
        endDate: 'Present',
        description:
          'Developing and maintaining web applications using PHP, Laravel, and Vue.js. Contributing to the development of IndoorCare, a workplace wellness software solution, and Water Delivery Philippines, an online platform for ordering drinking water.',
      },
      {
        jobTitle: 'Front-end Developer',
        company: 'Vaskeappen • Outsourced',
        location: 'Ørebro, Norway',
        startDate: 'Nov 2021',
        endDate: 'Aug 2022',
        description:
          'Developed and maintained front-end components for various projects using Vue.js and other modern web technologies. Collaborated with a remote team to ensure high-quality user experiences.',
      },
      {
        jobTitle: 'Full-stack Web Developer',
        company: 'Fourello • Full-Time',
        location: 'Philippines',
        startDate: 'Dec 2020',
        endDate: 'Oct 2022',
        description:
          'Developed and maintained web applications for clients such as 1Match Realty, Medgate, Inspire Church, and ZWell Philippines. Utilized PHP, Laravel, Vue.js, and other technologies to create robust and scalable solutions.',
      },
    ],
    education: [
      {
        degree: 'Universidad De Manila',
        school: 'BS Information Technology',
        startDate: '2019',
        endDate: '2023',
      },
      {
        degree: 'MHC-CAST',
        school: 'Senior High School',
        startDate: '2016',
        endDate: '2018',
      },
      {
        degree: 'Tondo High School',
        school: 'Junior High School',
        startDate: '2012',
        endDate: '2016',
      },
      {
        degree: 'Magat Salamat Elementary School',
        school: 'Elementary',
        startDate: '2008',
        endDate: '2012',
      },
    ],
    skills: [
      'PHP',
      'JavaScript',
      'TypeScript',
      'Laravel',
      'Node.js',
      'Vue.js',
      'React',
      'Docker',
      'Linux',
      'Git',
    ],
  };

  const mode: Mode = 'light';
  const settings = {
    theme: {
      preset: 'nature',
      styles: {
        light: {
          background: 'oklch(0.97 0.01 80.72)',
          foreground: 'oklch(0.30 0.04 30.20)',
          card: 'oklch(0.97 0.01 80.72)',
          'card-foreground': 'oklch(0.30 0.04 30.20)',
          popover: 'oklch(0.97 0.01 80.72)',
          'popover-foreground': 'oklch(0.30 0.04 30.20)',
          primary: 'oklch(0.52 0.13 144.17)',
          'primary-foreground': 'oklch(1.00 0 0)',
          secondary: 'oklch(0.96 0.02 147.64)',
          'secondary-foreground': 'oklch(0.43 0.12 144.31)',
          muted: 'oklch(0.94 0.01 74.42)',
          'muted-foreground': 'oklch(0.45 0.05 39.21)',
          accent: 'oklch(0.90 0.05 146.04)',
          'accent-foreground': 'oklch(0.43 0.12 144.31)',
          destructive: 'oklch(0.54 0.19 26.72)',
          border: 'oklch(0.88 0.02 74.64)',
          input: 'oklch(0.88 0.02 74.64)',
          ring: 'oklch(0.52 0.13 144.17)',
          'chart-1': 'oklch(0.67 0.16 144.21)',
          'chart-2': 'oklch(0.58 0.14 144.18)',
          'chart-3': 'oklch(0.52 0.13 144.17)',
          'chart-4': 'oklch(0.43 0.12 144.31)',
          'chart-5': 'oklch(0.22 0.05 145.73)',
          radius: '0.5rem',
          sidebar: 'oklch(0.94 0.01 74.42)',
          'sidebar-foreground': 'oklch(0.30 0.04 30.20)',
          'sidebar-primary': 'oklch(0.52 0.13 144.17)',
          'sidebar-primary-foreground': 'oklch(1.00 0 0)',
          'sidebar-accent': 'oklch(0.90 0.05 146.04)',
          'sidebar-accent-foreground': 'oklch(0.43 0.12 144.31)',
          'sidebar-border': 'oklch(0.88 0.02 74.64)',
          'sidebar-ring': 'oklch(0.52 0.13 144.17)',
          'font-sans': 'Montserrat, sans-serif',
          'font-serif': 'Merriweather, serif',
          'font-mono': 'Source Code Pro, monospace',
          'shadow-color': 'hsl(0 0% 0%)',
          'shadow-opacity': '0.1',
          'shadow-blur': '3px',
          'shadow-spread': '0px',
          'shadow-offset-x': '0',
          'shadow-offset-y': '1px',
          'letter-spacing': '0em',
          spacing: '0.25rem',
        },
        dark: {
          background: 'oklch(0.27 0.03 150.77)',
          foreground: 'oklch(0.94 0.01 72.66)',
          card: 'oklch(0.33 0.03 146.99)',
          'card-foreground': 'oklch(0.94 0.01 72.66)',
          popover: 'oklch(0.33 0.03 146.99)',
          'popover-foreground': 'oklch(0.94 0.01 72.66)',
          primary: 'oklch(0.67 0.16 144.21)',
          'primary-foreground': 'oklch(0.22 0.05 145.73)',
          secondary: 'oklch(0.39 0.03 142.99)',
          'secondary-foreground': 'oklch(0.90 0.02 142.55)',
          muted: 'oklch(0.33 0.03 146.99)',
          'muted-foreground': 'oklch(0.86 0.02 76.10)',
          accent: 'oklch(0.58 0.14 144.18)',
          'accent-foreground': 'oklch(0.94 0.01 72.66)',
          destructive: 'oklch(0.54 0.19 26.72)',
          border: 'oklch(0.39 0.03 142.99)',
          input: 'oklch(0.39 0.03 142.99)',
          ring: 'oklch(0.67 0.16 144.21)',
          'chart-1': 'oklch(0.77 0.12 145.30)',
          'chart-2': 'oklch(0.72 0.14 144.89)',
          'chart-3': 'oklch(0.67 0.16 144.21)',
          'chart-4': 'oklch(0.63 0.15 144.20)',
          'chart-5': 'oklch(0.58 0.14 144.18)',
          sidebar: 'oklch(0.27 0.03 150.77)',
          'sidebar-foreground': 'oklch(0.94 0.01 72.66)',
          'sidebar-primary': 'oklch(0.67 0.16 144.21)',
          'sidebar-primary-foreground': 'oklch(0.22 0.05 145.73)',
          'sidebar-accent': 'oklch(0.58 0.14 144.18)',
          'sidebar-accent-foreground': 'oklch(0.94 0.01 72.66)',
          'sidebar-border': 'oklch(0.39 0.03 142.99)',
          'sidebar-ring': 'oklch(0.67 0.16 144.21)',
          'shadow-color': 'hsl(0 0% 0%)',
          'shadow-opacity': '0.1',
          'shadow-blur': '3px',
          'shadow-spread': '0px',
          'shadow-offset-x': '0',
          'shadow-offset-y': '1px',
          'letter-spacing': '0em',
          spacing: '0.25rem',
        },
        css: {},
      },
    },
    mode,
  };

  return (
    <PreviewWrapper settings={settings} mode={mode}>
      <Card>
        <CardContent className="p-6 md:p-8 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1 mb-6 md:mb-0 md:pr-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {resumeData.name}
              </h1>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4">
                {resumeData.title}
              </p>
              <p className="text-gray-500 text-sm mb-4">{resumeData.location}</p>

              <div className="flex items-center space-x-4">
                <Globe className="w-5 h-5 text-gray-400" />
                <Mail className="w-5 h-5 text-gray-400" />
                <Phone className="w-5 h-5 text-gray-400" />
                <Github className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="flex-shrink-0">
              <Avatar className="w-24 h-24 md:w-32 md:h-32">
                <AvatarImage src="/professional-headshot.png" />
                <AvatarFallback className="text-2xl">SC</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed">{resumeData.about}</p>
          </div>

          <div className="flex items-start gap-5">
            <div className="flex flex-col justify-start gap-10">
              {/* Skills Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gray-800 text-white hover:bg-gray-700 px-3 py-1 text-sm"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Education Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Education</h2>
                <div className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:items-center md:justify-between py-2"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-gray-600">{edu.school}</p>
                      </div>
                      <div className="text-gray-500 text-sm mt-1 md:mt-0">
                        {edu.startDate} - {edu.endDate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-start gap-10">
              {/* Work Experience Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Work Experience</h2>
                <div className="space-y-8">
                  {resumeData.workExperience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-gray-100 pl-6 relative">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{exp.jobTitle}</h3>
                          <p className="text-gray-600 font-medium">{exp.company}</p>
                          <p className="text-gray-500 text-sm">{exp.location}</p>
                        </div>
                        <div className="text-gray-500 text-sm mt-1 md:mt-0">
                          {exp.startDate} - {exp.endDate}
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Projects</h2>
                <div className="space-y-8">
                  {resumeData.workExperience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-gray-100 pl-6 relative">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{exp.jobTitle}</h3>
                          <p className="text-gray-600 font-medium">{exp.company}</p>
                          <p className="text-gray-500 text-sm">{exp.location}</p>
                        </div>
                        <div className="text-gray-500 text-sm mt-1 md:mt-0">
                          {exp.startDate} - {exp.endDate}
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PreviewWrapper>
  );
}
