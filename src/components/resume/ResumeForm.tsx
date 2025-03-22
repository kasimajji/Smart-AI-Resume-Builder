import { Card } from '@/components/ui/card';
import { ContactInfo } from './ContactInfo';
import { WorkExperience } from './WorkExperience';
import { Education } from './Education';
import { Skills } from './Skills';

/**
 * ResumeForm Component
 * Main container component that combines all resume sections
 */
export function ResumeForm() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6">Resume Builder</h1>
        <div className="space-y-8">
          <ContactInfo />
          <WorkExperience />
          <Education />
          <Skills />
        </div>
      </Card>
    </div>
  );
}