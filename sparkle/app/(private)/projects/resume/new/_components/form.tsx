"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { X, Calendar, Plus } from "lucide-react"

export function Form() {
  const [formData, setFormData] = useState({
    name: "Jose J",
    location: "Mandaluyong City, National Capital R",
    shortAbout:
      "Experienced financial and operations professional with a strong background in managing financial transactions, invoicing, and client relationships. Skilled in ensuring accurate and timely financial reporting and maintaining client trust.",
    email: "jh.aquamonia@gmail.com",
    phone: "Your phone number",
    website: "your-website.com",
    github: "github.com/ username",
    linkedin: "linkedin.com/in/ username",
    twitter: "x.com/ username",
    about:
      "Dedicated financial and operations professional with a proven track record in managing financial transactions, invoicing, and client relationships. Adept at ensuring accurate and timely financial reporting and maintaining client trust. Skilled in handling various payment methods and maintaining detailed financial records.",
    workExperience: [
      {
        jobTitle: "Financial and Operations Manager",
        company: "Aquamonia Trading",
        location: "Mandaluyong City, National Capital",
        startDate: "Jul 2025",
        endDate: "Pick an end month",
        description:
          "Responsible for managing financial transactions, invoicing, and client relationships. Ensured accurate and timely financial reporting and maintained client trust. Handled various payment methods including Cash on Delivery (COD) and online payments for the Finance department.",
      },
    ],
    education: [
      {
        degree: "Degree",
        school: "School",
        startDate: "Pick a start month",
        endDate: "Pick an end month",
      },
    ],
    skills: [
      "Financial Management",
      "Invoicing",
      "Client Relationship Management",
      "Payment Processing",
      "Cash on Delivery (COD)",
      "Online Payments",
      "Financial Reporting",
      "Transaction Management",
      "Banking Operations",
      "Customer Service",
    ],
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleWorkExperienceChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)),
    }))
  }

  const handleEducationChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }))
  }

  const addSkill = () => {
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, "Add Skill"] }))
  }

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  return (
    <Card>
      <CardContent>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Header</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Short About</label>
            <Textarea
              value={formData.shortAbout}
              onChange={(e) => handleInputChange("shortAbout", e.target.value)}
              className="w-full h-20 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full "
                placeholder="Your phone number"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-4">Social Links</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs  mb-2">Website</label>
                <Input
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="w-full "
                />
              </div>
              <div>
                <label className="block text-xs  mb-2">GitHub</label>
                <Input
                  value={formData.github}
                  onChange={(e) => handleInputChange("github", e.target.value)}
                  className="w-full "
                />
              </div>
              <div>
                <label className="block text-xs  mb-2">LinkedIn</label>
                <Input
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange("linkedin", e.target.value)}
                  className="w-full "
                />
              </div>
              <div>
                <label className="block text-xs  mb-2">Twitter/X</label>
                <Input
                  value={formData.twitter}
                  onChange={(e) => handleInputChange("twitter", e.target.value)}
                  className="w-full "
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About</h2>
          <Textarea
            value={formData.about}
            onChange={(e) => handleInputChange("about", e.target.value)}
            className="w-full h-32 resize-none"
          />
        </div>
        <div className="mb-8 border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Work Experience</h2>
            <Button variant="ghost" size="sm" className="text-gray-400">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Job Title</label>
              <Input
                value={formData.workExperience[0].jobTitle}
                onChange={(e) => handleWorkExperienceChange(0, 'jobTitle', e.target.value)}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <Input
                  value={formData.workExperience[0].company}
                  onChange={(e) => handleWorkExperienceChange(0, 'company', e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input
                  value={formData.workExperience[0].location}
                  onChange={(e) => handleWorkExperienceChange(0, 'location', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date Range</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs  mb-2">Start Date</label>
                  <div className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{formData.workExperience[0].startDate}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs  mb-2">End Date</label>
                  <div className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm ">{formData.workExperience[0].endDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.workExperience[0].description}
                onChange={(e) => handleWorkExperienceChange(0, 'description', e.target.value)}
                className="w-full h-24 resize-none"
              />
            </div>
          </div>

          <Button variant="outline" className="mt-6">
            <Plus className="w-4 h-4 mr-2" />
            Add Work Experience
          </Button>
        </div>
        <div className="mb-8 border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Education</h2>
            <Button variant="ghost" size="sm" className="text-gray-400">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Degree</label>
              <Input
                value={formData.education[0].degree}
                onChange={(e) => handleEducationChange(0, "degree", e.target.value)}
                className="w-full "
                placeholder="Degree"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">School</label>
              <Input
                value={formData.education[0].school}
                onChange={(e) => handleEducationChange(0, "school", e.target.value)}
                className="w-full "
                placeholder="School"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date Range</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs  mb-2">Start Date</label>
                  <div className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm ">{formData.education[0].startDate}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs  mb-2">End Date</label>
                  <div className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm ">{formData.education[0].endDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button variant="outline" className="mt-6">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Skills</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {formData.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 flex items-center space-x-2"
              >
                <span>{skill}</span>
                <button onClick={() => removeSkill(index)} className="text-gray-400 hover:">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>

          <Button variant="outline" className="mt-6">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
