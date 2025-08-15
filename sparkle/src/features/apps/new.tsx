import { useState } from 'react'
import { X, Calendar, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

export default function NewProject() {
  const [formData, setFormData] = useState({
    name: 'Jose J',
    location: 'Mandaluyong City, National Capital R',
    shortAbout:
      'Experienced financial and operations professional with a strong background in managing financial transactions, invoicing, and client relationships. Skilled in ensuring accurate and timely financial reporting and maintaining client trust.',
    email: 'jh.aquamonia@gmail.com',
    phone: 'Your phone number',
    website: 'your-website.com',
    github: 'github.com/ username',
    linkedin: 'linkedin.com/in/ username',
    twitter: 'x.com/ username',
    about:
      'Dedicated financial and operations professional with a proven track record in managing financial transactions, invoicing, and client relationships. Adept at ensuring accurate and timely financial reporting and maintaining client trust. Skilled in handling various payment methods and maintaining detailed financial records.',
    workExperience: [
      {
        jobTitle: 'Financial and Operations Manager',
        company: 'Aquamonia Trading',
        location: 'Mandaluyong City, National Capital',
        startDate: 'Jul 2025',
        endDate: 'Pick an end month',
        description:
          'Responsible for managing financial transactions, invoicing, and client relationships. Ensured accurate and timely financial reporting and maintained client trust. Handled various payment methods including Cash on Delivery (COD) and online payments for the Finance department.',
      },
    ],
    education: [
      {
        degree: 'Degree',
        school: 'School',
        startDate: 'Pick a start month',
        endDate: 'Pick an end month',
      },
    ],
    skills: [
      'Financial Management',
      'Invoicing',
      'Client Relationship Management',
      'Payment Processing',
      'Cash on Delivery (COD)',
      'Online Payments',
      'Financial Reporting',
      'Transaction Management',
      'Banking Operations',
      'Customer Service',
    ],
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleWorkExperienceChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }))
  }

  const handleEducationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }))
  }

  const addSkill = () => {
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, 'Add Skill'] }))
  }

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main>
        <div className='mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8'>
          <Card className='shadow-sm'>
            <CardContent className='p-8'>
              {/* Header Section */}
              <div className='mb-8'>
                <h2 className='mb-6 text-lg font-semibold'>Header</h2>

                <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div>
                    <label className='mb-2 block text-sm font-medium'>
                      Name
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      className='w-full'
                    />
                  </div>
                  <div>
                    <label className='mb-2 block text-sm font-medium'>
                      Location
                    </label>
                    <Input
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange('location', e.target.value)
                      }
                      className='w-full'
                    />
                  </div>
                </div>

                <div className='mb-6'>
                  <label className='mb-2 block text-sm font-medium'>
                    Short About
                  </label>
                  <Textarea
                    value={formData.shortAbout}
                    onChange={(e) =>
                      handleInputChange('shortAbout', e.target.value)
                    }
                    className='h-20 w-full resize-none'
                  />
                </div>

                <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div>
                    <label className='mb-2 block text-sm font-medium'>
                      Email
                    </label>
                    <Input
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      className='w-full'
                    />
                  </div>
                  <div>
                    <label className='mb-2 block text-sm font-medium'>
                      Phone Number
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                      className='w-full'
                      placeholder='Your phone number'
                    />
                  </div>
                </div>

                <div className='mb-6'>
                  <label className='mb-4 block text-sm font-medium'>
                    Social Links
                  </label>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div>
                      <label className='mb-2 block text-xs'>Website</label>
                      <Input
                        value={formData.website}
                        onChange={(e) =>
                          handleInputChange('website', e.target.value)
                        }
                        className='w-full'
                      />
                    </div>
                    <div>
                      <label className='mb-2 block text-xs'>GitHub</label>
                      <Input
                        value={formData.github}
                        onChange={(e) =>
                          handleInputChange('github', e.target.value)
                        }
                        className='w-full'
                      />
                    </div>
                    <div>
                      <label className='mb-2 block text-xs'>LinkedIn</label>
                      <Input
                        value={formData.linkedin}
                        onChange={(e) =>
                          handleInputChange('linkedin', e.target.value)
                        }
                        className='w-full'
                      />
                    </div>
                    <div>
                      <label className='mb-2 block text-xs'>Twitter/X</label>
                      <Input
                        value={formData.twitter}
                        onChange={(e) =>
                          handleInputChange('twitter', e.target.value)
                        }
                        className='w-full'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className='mb-8 border-t border-gray-200 pt-8'>
                <h2 className='mb-6 text-lg font-semibold'>About</h2>
                <Textarea
                  value={formData.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  className='h-32 w-full resize-none'
                />
              </div>

              {/* Work Experience Section */}
              <div className='mb-8 border-t border-gray-200 pt-8'>
                <div className='mb-6 flex items-center justify-between'>
                  <h2 className='text-lg font-semibold'>Work Experience</h2>
                  <Button variant='ghost' size='sm' className='text-gray-400'>
                    <X className='h-4 w-4' />
                  </Button>
                </div>

                <div className='space-y-6'>
                  <div>
                    <label className='mb-2 block text-sm font-medium'>
                      Job Title
                    </label>
                    <Input
                      value={formData.workExperience[0].jobTitle}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          0,
                          'jobTitle',
                          e.target.value
                        )
                      }
                      className='w-full'
                    />
                  </div>

                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div>
                      <label className='mb-2 block text-sm font-medium'>
                        Company
                      </label>
                      <Input
                        value={formData.workExperience[0].company}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            0,
                            'company',
                            e.target.value
                          )
                        }
                        className='w-full'
                      />
                    </div>
                    <div>
                      <label className='mb-2 block text-sm font-medium'>
                        Location
                      </label>
                      <Input
                        value={formData.workExperience[0].location}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            0,
                            'location',
                            e.target.value
                          )
                        }
                        className='w-full'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='mb-2 block text-sm font-medium'>
                      Date Range
                    </label>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <div>
                        <label className='mb-2 block text-xs'>Start Date</label>
                        <div className='flex items-center space-x-2 rounded-md border border-gray-300 px-3 py-2'>
                          <Calendar className='h-4 w-4 text-gray-400' />
                          <span className='text-sm'>
                            {formData.workExperience[0].startDate}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className='mb-2 block text-xs'>End Date</label>
                        <div className='flex items-center space-x-2 rounded-md border border-gray-300 px-3 py-2'>
                          <Calendar className='h-4 w-4 text-gray-400' />
                          <span className='text-sm'>
                            {formData.workExperience[0].endDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className='mb-2 block text-sm font-medium'>
                      Description
                    </label>
                    <Textarea
                      value={formData.workExperience[0].description}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          0,
                          'description',
                          e.target.value
                        )
                      }
                      className='h-24 w-full resize-none'
                    />
                  </div>
                </div>

                <Button
                  variant='ghost'
                  className='mt-6 text-blue-600 hover:text-blue-700'
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Add Work Experience
                </Button>
              </div>

              {/* Education Section */}
              <div className='mb-8 border-t border-gray-200 pt-8'>
                <div className='mb-6 flex items-center justify-between'>
                  <h2 className='text-lg font-semibold'>Education</h2>
                  <Button variant='ghost' size='sm' className='text-gray-400'>
                    <X className='h-4 w-4' />
                  </Button>
                </div>

                <div className='space-y-6'>
                  <div>
                    <label className='mb-2 block text-sm font-medium'>
                      Degree
                    </label>
                    <Input
                      value={formData.education[0].degree}
                      onChange={(e) =>
                        handleEducationChange(0, 'degree', e.target.value)
                      }
                      className='w-full'
                      placeholder='Degree'
                    />
                  </div>

                  <div>
                    <label className='mb-2 block text-sm font-medium'>
                      School
                    </label>
                    <Input
                      value={formData.education[0].school}
                      onChange={(e) =>
                        handleEducationChange(0, 'school', e.target.value)
                      }
                      className='w-full'
                      placeholder='School'
                    />
                  </div>

                  <div>
                    <label className='mb-2 block text-sm font-medium'>
                      Date Range
                    </label>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <div>
                        <label className='mb-2 block text-xs'>Start Date</label>
                        <div className='flex items-center space-x-2 rounded-md border border-gray-300 px-3 py-2'>
                          <Calendar className='h-4 w-4 text-gray-400' />
                          <span className='text-sm'>
                            {formData.education[0].startDate}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className='mb-2 block text-xs'>End Date</label>
                        <div className='flex items-center space-x-2 rounded-md border border-gray-300 px-3 py-2'>
                          <Calendar className='h-4 w-4 text-gray-400' />
                          <span className='text-sm'>
                            {formData.education[0].endDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant='ghost'
                  className='mt-6 text-blue-600 hover:text-blue-700'
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Add Education
                </Button>
              </div>

              {/* Skills Section */}
              <div className='border-t pt-8'>
                <h2 className='mb-6 text-lg font-semibold'>Skills</h2>

                <div className='mb-4 flex flex-wrap gap-2'>
                  {formData.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className='flex items-center space-x-2 px-3 py-1'
                    >
                      <span>{skill}</span>
                      <button onClick={() => removeSkill(index)}>
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  ))}
                </div>

                <Button
                  variant='ghost'
                  onClick={addSkill}
                  className='text-blue-600 hover:text-blue-700'
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Add Skill
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
