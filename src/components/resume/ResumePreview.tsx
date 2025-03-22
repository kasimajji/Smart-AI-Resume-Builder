import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { Globe, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import type { Resume } from '@/types/resume.types';

interface ResumePreviewProps {
  resume: Resume | null;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  if (!resume) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">No resume data available</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{resume.contactInfo.fullName}</h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          {resume.contactInfo.email && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {resume.contactInfo.email}
                </TooltipTrigger>
                <TooltipContent>Email</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {resume.contactInfo.phone && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {resume.contactInfo.phone}
                </TooltipTrigger>
                <TooltipContent>Phone</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {resume.contactInfo.location && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {resume.contactInfo.location}
                </TooltipTrigger>
                <TooltipContent>Location</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {resume.contactInfo.website && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <a
                    href={resume.contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    Portfolio
                  </a>
                </TooltipTrigger>
                <TooltipContent>Website</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {resume.contactInfo.linkedin && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1">
                  <Linkedin className="h-4 w-4" />
                  <a
                    href={resume.contactInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    LinkedIn
                  </a>
                </TooltipTrigger>
                <TooltipContent>LinkedIn Profile</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Work Experience Section */}
      {resume.workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Work Experience</h2>
          <div className="space-y-6">
            {resume.workExperience.map((experience) => (
              <Card key={experience.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{experience.position}</h3>
                    <p className="text-muted-foreground">{experience.company}</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{formatDate(experience.startDate)} - {experience.current ? 'Present' : formatDate(experience.endDate)}</p>
                    <p>{experience.location}</p>
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {experience.description.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {resume.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Education</h2>
          <div className="space-y-6">
            {resume.education.map((edu) => (
              <Card key={edu.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{edu.institution}</h3>
                    <p className="text-muted-foreground">
                      {edu.degree} in {edu.field}
                    </p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                    <p>{edu.location}</p>
                    {edu.gpa && <p>GPA: {edu.gpa.toFixed(2)}</p>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {resume.skills.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Skills</h2>
          <div className="space-y-4">
            {Array.from(new Set(resume.skills.map(skill => skill.category))).map(category => (
              <div key={category}>
                <h3 className="text-lg font-medium mb-2">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {resume.skills
                    .filter(skill => skill.category === category)
                    .map(skill => (
                      <TooltipProvider key={skill.id}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="secondary">{skill.name}</Badge>
                          </TooltipTrigger>
                          <TooltipContent>{skill.level}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}