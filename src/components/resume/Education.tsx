import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import type { Education as EducationType } from '@/types/resume.types';
import { useResumeStore } from '@/store/resumeStore';

/**
 * Schema for education validation
 */
const educationSchema = z.object({
  education: z.array(
    z.object({
      institution: z.string().min(2, 'Institution name must be at least 2 characters'),
      degree: z.string().min(2, 'Degree must be at least 2 characters'),
      field: z.string().min(2, 'Field of study must be at least 2 characters'),
      startDate: z.string(),
      endDate: z.string(),
      location: z.string().min(2, 'Location must be at least 2 characters'),
      gpa: z.number().min(0).max(4).optional(),
    })
  ),
});

type EducationForm = {
  education: Omit<EducationType, 'id'>[];
};

/**
 * Education Component
 * Manages the education section of the resume builder
 */
export function Education() {
  const { resume, addEducation, updateEducation, removeEducation } =
    useResumeStore();

  const form = useForm<EducationForm>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: resume?.education.map((edu) => ({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        startDate: edu.startDate,
        endDate: edu.endDate,
        location: edu.location,
        gpa: edu.gpa,
      })) || [],
    },
  });

  const { fields } = useFieldArray({
    name: 'education',
    control: form.control,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {/* Form fields will be implemented in the next phase */}
        </Form>
      </CardContent>
    </Card>
  );
}