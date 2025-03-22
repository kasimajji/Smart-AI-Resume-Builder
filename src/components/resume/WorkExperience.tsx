import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import type { WorkExperience as WorkExperienceType } from '@/types/resume.types';
import { useResumeStore } from '@/store/resumeStore';

/**
 * Schema for work experience validation
 */
const workExperienceSchema = z.object({
  experiences: z.array(
    z.object({
      company: z.string().min(2, 'Company name must be at least 2 characters'),
      position: z.string().min(2, 'Position must be at least 2 characters'),
      location: z.string().min(2, 'Location must be at least 2 characters'),
      startDate: z.string(),
      endDate: z.string(),
      current: z.boolean(),
      description: z.array(z.string()),
    })
  ),
});

type WorkExperienceForm = {
  experiences: Omit<WorkExperienceType, 'id'>[];
};

/**
 * WorkExperience Component
 * Manages the work experience section of the resume builder
 */
export function WorkExperience() {
  const { resume, addWorkExperience, updateWorkExperience, removeWorkExperience } =
    useResumeStore();

  const form = useForm<WorkExperienceForm>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      experiences: resume?.workExperience.map((exp) => ({
        company: exp.company,
        position: exp.position,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        current: exp.current,
        description: exp.description,
      })) || [],
    },
  });

  const { fields } = useFieldArray({
    name: 'experiences',
    control: form.control,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {/* Form fields will be implemented in the next phase */}
        </Form>
      </CardContent>
    </Card>
  );
}