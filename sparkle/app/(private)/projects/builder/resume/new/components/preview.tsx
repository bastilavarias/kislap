"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Mail, Phone, Github } from "lucide-react"

export function Preview() {
  const resumeData = {
    name: "Sebastian Curtis Lavarias",
    title:
      "Experienced Full-stack Web Developer with a strong background in PHP, JavaScript, and modern web technologies. Skilled in developing and maintaining scalable web applications and platforms. Passionate about leveraging technology to solve real-world problems and enhance user experiences.",
    location: "Philippines",
    email: "sebastian@email.com",
    phone: "+63 123 456 7890",
    website: "sebastian-dev.com",
    github: "github.com/sebastian",
    about:
      "Experienced Full-stack Web Developer with a strong background in PHP, JavaScript, and modern web technologies. Skilled in developing and maintaining scalable web applications and platforms. Passionate about leveraging technology to solve real-world problems and enhance user experiences.",
    workExperience: [
      {
        jobTitle: "Full-stack Web Developer",
        company: "Chanzit • Full-Time",
        location: "Philippines",
        startDate: "Oct 2022",
        endDate: "Present",
        description:
          "Developing and maintaining web applications using PHP, Laravel, and Vue.js. Contributing to the development of IndoorCare, a workplace wellness software solution, and Water Delivery Philippines, an online platform for ordering drinking water.",
      },
      {
        jobTitle: "Front-end Developer",
        company: "Vaskeappen • Outsourced",
        location: "Ørebro, Norway",
        startDate: "Nov 2021",
        endDate: "Aug 2022",
        description:
          "Developed and maintained front-end components for various projects using Vue.js and other modern web technologies. Collaborated with a remote team to ensure high-quality user experiences.",
      },
      {
        jobTitle: "Full-stack Web Developer",
        company: "Fourello • Full-Time",
        location: "Philippines",
        startDate: "Dec 2020",
        endDate: "Oct 2022",
        description:
          "Developed and maintained web applications for clients such as 1Match Realty, Medgate, Inspire Church, and ZWell Philippines. Utilized PHP, Laravel, Vue.js, and other technologies to create robust and scalable solutions.",
      },
    ],
    education: [
      {
        degree: "Universidad De Manila",
        school: "BS Information Technology",
        startDate: "2019",
        endDate: "2023",
      },
      {
        degree: "MHC-CAST",
        school: "Senior High School",
        startDate: "2016",
        endDate: "2018",
      },
      {
        degree: "Tondo High School",
        school: "Junior High School",
        startDate: "2012",
        endDate: "2016",
      },
      {
        degree: "Magat Salamat Elementary School",
        school: "Elementary",
        startDate: "2008",
        endDate: "2012",
      },
    ],
    skills: ["PHP", "JavaScript", "TypeScript", "Laravel", "Node.js", "Vue.js", "React", "Docker", "Linux", "Git"],
  }

  return (
    <Card>
      <CardContent className="p-6 md:p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1 mb-6 md:mb-0 md:pr-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{resumeData.name}</h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4">{resumeData.title}</p>
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

        {/* Education Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Education</h2>
          <div className="space-y-4">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="flex flex-col md:flex-row md:items-center md:justify-between py-2">
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
      </CardContent>
    </Card>
  )
}
