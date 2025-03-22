import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import type { CoverLetter } from '@/types/resume.types';
import { useResumeStore } from '@/store/resumeStore';

interface CoverLetterPreviewProps {
  coverLetter: Omit<CoverLetter, 'id' | 'content' | 'lastUpdated'>;
}

export function CoverLetterPreview({ coverLetter }: CoverLetterPreviewProps) {
  const { resumes } = useResumeStore();
  const selectedResume = resumes.find((r) => r.id === coverLetter.resumeId);

  if (!selectedResume) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">No resume data available</p>
      </div>
    );
  }

  const currentDate = format(new Date(), 'MMMM d, yyyy');

  return (
    <Card className="p-8 max-w-[800px] mx-auto bg-white">
      <div className="space-y-8">
        {/* Sender's Information */}
        <div className="text-right">
          <p>{selectedResume.contactInfo.fullName}</p>
          <p>{selectedResume.contactInfo.email}</p>
          <p>{selectedResume.contactInfo.phone}</p>
          <p>{selectedResume.contactInfo.location}</p>
        </div>

        {/* Date */}
        <div>
          <p>{currentDate}</p>
        </div>

        {/* Recipient's Information */}
        <div>
          <p>{coverLetter.recipientName}</p>
          <p>{coverLetter.recipientTitle}</p>
          <p>{coverLetter.companyName}</p>
          <p>{coverLetter.companyAddress}</p>
        </div>

        {/* Greeting */}
        <div>
          <p>Dear {coverLetter.recipientName},</p>
        </div>

        {/* Body Paragraphs - Placeholder content */}
        <div className="space-y-4">
          <p>
            I am writing to express my strong interest in the {coverLetter.jobTitle} position
            at {coverLetter.companyName}. With my background in {selectedResume.workExperience[0]?.position || 'software development'} and
            experience at {selectedResume.workExperience[0]?.company || 'leading technology companies'}, I am confident in my ability to
            contribute significantly to your team.
          </p>

          <p>
            Throughout my career at {selectedResume.workExperience[0]?.company || 'previous companies'}, I have
            developed expertise in {selectedResume.skills.slice(0, 3).map(skill => skill.name).join(', ')}.
            This combination of skills and experience makes me particularly well-suited for the
            {coverLetter.jobTitle} role.
          </p>

          <p>
            I am particularly drawn to {coverLetter.companyName} because of its reputation for
            innovation and commitment to excellence. I am confident that my skills and enthusiasm
            would make me a valuable addition to your team.
          </p>
        </div>

        {/* Closing */}
        <div className="space-y-4">
          <p>
            Thank you for considering my application. I look forward to discussing how I can
            contribute to {coverLetter.companyName}.
          </p>

          <p>Sincerely,</p>
          <p>{selectedResume.contactInfo.fullName}</p>
        </div>
      </div>
    </Card>
  );
}