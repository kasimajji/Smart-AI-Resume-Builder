import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ContactInfo } from './ContactInfo';
import { WorkExperience } from './WorkExperience';
import { Education } from './Education';
import { Skills } from './Skills';
import { useResumeStore } from '@/store/resumeStore';

/**
 * ResumeForm Component
 * Main container component that combines all resume sections
 */
export function ResumeForm() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { resume } = useResumeStore();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Resume Builder</h1>
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" data-testid="preview-button">
                Preview Resume
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Resume Preview</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(resume, null, 2)}
                </pre>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-8">
          <section data-testid="contact-info-section">
            <ContactInfo />
          </section>
          <section data-testid="work-experience-section">
            <WorkExperience />
          </section>
          <section data-testid="education-section">
            <Education />
          </section>
          <section data-testid="skills-section">
            <Skills />
          </section>
        </div>
      </Card>
    </div>
  );
}